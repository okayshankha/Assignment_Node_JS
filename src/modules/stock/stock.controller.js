const _ = require('lodash')
const StockMetadata = require("./../../models/stock-metadata")
const User = require("./../../models/user")
const Stock = require("./../../models/stock")
const stockScanDTO = require('./dtos/stock-scan-dto')
const stockScanHistoryDTO = require('./dtos/stock-scan-history-dto')
const responseHelper = require('./../../lib/responseHelper')


// Initiate alphavantage
const alphavantage = require('./../../lib/alphavantage')
const { ALPHAVANTAGE_API_KEY } = require('./../../../config')
alphavantage.configure({ key: ALPHAVANTAGE_API_KEY })


async function _getStockMetaData(symbol) {
    try {
        // Try the find Stock Meta data is available on system
        let stockMetadata = await StockMetadata.getBySymbol(symbol)
        if (!stockMetadata) {

            // If system does not have metadata for the Stock Symbol, Try to fetch it from 3rd party API
            const stockMetadataFrom3rdPartyApi = await alphavantage.CompanyOverview({ symbol })

            if (stockMetadataFrom3rdPartyApi) {
                // If data found insert it to database
                console.log(stockMetadataFrom3rdPartyApi);

                stockMetadata = new StockMetadata(stockMetadataFrom3rdPartyApi)
                await stockMetadata.validate()
                await stockMetadata.save()
            }
        }
        return stockMetadata
    } catch (error) {
        throw error
    }
}


async function _getStockData(stockMeta, _user, reScan = false) {
    try {
        // Try the find Stock data is available on system
        const { _id: _stockMetadata, name, symbol } = stockMeta

        // If reScan flag is true, we will delete the previous Stock data(id available), and fetch updated Stock data
        if (reScan) {
            await Stock.deleteMany({ _stockMetadata, _user })
        }

        let stockData = await Stock.find({ _stockMetadata, _user })
        if (!stockData.length) {

            // If system does not have Stock data for the Stock Symbol, Try to fetch it from 3rd party API
            const stockDataFrom3rdParty = await alphavantage.Intraday({ symbol })

            for (let index = 0; index < stockDataFrom3rdParty.length && index < 10; index++) {
                const element = stockDataFrom3rdParty[index];

                // Try to destructure the data
                const {
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    volume
                } = element

                // If data found insert it to database
                const stock = new Stock({
                    _stockMetadata,
                    _user,
                    stock: {
                        name,
                        symbol,
                    },
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    volume,
                })
                await stock.validate()
                await stock.save()
                stockData.push(stock)
            }
        }
        return stockData
    } catch (error) {
        throw error
    }
}


module.exports = {
    async scan(req, res) {
        try {
            const { user: LoggedUser } = req
            const { query } = req
            const validationResult = stockScanDTO.validate(query)
            if (validationResult.error) {
                const { error } = validationResult
                return responseHelper(res, error, 'UnprocessableEntity')
            }

            const { symbol: symbolRaw, reScan } = query
            const symbol = symbolRaw.trim()

            // Try the find Stock Meta data
            let stockMetadata = await _getStockMetaData(symbol)

            if (!stockMetadata) {
                return responseHelper(res, 'Stock Metadata not found for this symbol.', 'BadRequest')
            }

            // Now, try to fetch the Stock data for the Symbol
            let stockData = await _getStockData(stockMetadata, LoggedUser._id, reScan)
            if (!stockData.length) {
                return responseHelper(res, 'Stock data not found for this symbol.', 'BadRequest')
            }

            // Add the Stock Search data to user document
            const user = await User.getById(LoggedUser._id)
            const { stockSearchHistory } = user.toJSON()
            const hasInHistoryResult = _.find(stockSearchHistory, { _stockMetadata: stockMetadata._id })
            if (!hasInHistoryResult) {
                user.stockSearchHistory.push({
                    _stockMetadata: stockMetadata._id,
                    stock: {
                        name: stockMetadata.name,
                        symbol: stockMetadata.symbol,
                    },
                })
                await user.validate()
                await user.save()
            }




            const items = stockData

            return responseHelper(res, { message: 'Stock fetch successful.', items })

        } catch (error) {
            return responseHelper(res, error, 'Error')
        }
    },



    async scanHistory(req, res) {
        try {
            const { user: LoggedUser } = req
            const { query } = req
            const validationResult = stockScanHistoryDTO.validate(query)
            if (validationResult.error) {
                const { error } = validationResult
                return responseHelper(res, error, 'UnprocessableEntity')
            }

            // Allow search by symbol
            const { symbol } = query

            // Fetch the sub-document named stockSearchHistory in user
            const user = await User.getById(LoggedUser._id)
            const { stockSearchHistory } = user.toJSON()

            let items = null
            if (symbol) {
                const hasInHistoryResult = _.find(stockSearchHistory, { stock: { symbol } })
                items = hasInHistoryResult
            } else {
                items = stockSearchHistory
            }

            return responseHelper(res, { message: 'Stock search history fetch successful.', items })

        } catch (error) {
            return responseHelper(res, error, 'Error')
        }
    }
}