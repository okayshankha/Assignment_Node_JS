const axios = require('axios')
const _ = require('lodash')
const CsvParser = require('papaparse')


const baseUrl = 'https://www.alphavantage.co'
let API_KEY = null


module.exports = {
    configure: ({ key }) => {
        API_KEY = key
    },

    CompanyOverview: async ({ symbol }) => {
        try {
            const url = `${baseUrl}/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`

            // Fetch data from Alphavantage API
            const result = await axios.get(url)

            if (result) {
                const { data } = result

                // Destructure the data
                const {
                    Symbol,
                    AssetType,
                    Name,
                    Description,
                    Currency,
                    Country
                } = data

                // Create a data object with camelcased data
                const resultSubset = _.pickBy({
                    Symbol,
                    AssetType,
                    Name,
                    Description,
                    Currency,
                    Country
                }, _.identity)

                if (Object.keys(resultSubset).length) {
                    const camelcasedResultSubset = _.mapKeys(resultSubset, (v, k) => _.camelCase(k))
                    return camelcasedResultSubset
                } else {
                    return null
                }
            }

        } catch (error) {
            throw error
        }
    },

    Intraday: async ({ symbol }) => {
        try {
            const url = `${baseUrl}/query?function=TIME_SERIES_INTRADAY&datatype=csv&symbol=${symbol}&apikey=${API_KEY}&interval=1min`

            // Fetch data from Alphavantage API
            const result = await axios.get(url, { responseType: 'blob' })

            if (result) {
                const { data: csvData } = result

                // Parse CSV data
                const { data } = CsvParser.parse(csvData, { header: true, skipEmptyLines: true })
                return data
            }

        } catch (error) {
            throw error
        }
    }
}