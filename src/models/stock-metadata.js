const dataStore = require('../core/dataStore')
const _ = require('lodash')

const schemaDefinition = {
    symbol: { type: String, required: true, unique: true },
    assetType: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    currency: { type: String, required: true },
    country: { type: String, required: true }
};

// e.g. we might want to pass in a second argument to the schema constructor
const schema = new dataStore.Schema(schemaDefinition, {
    autoIndex: true,
    versionKey: false,
    timestamps: true
})


// Before Save Hook
schema.pre('save', function (next) {
    // const document = this

    next()
})


/**
 * *************************************************
 *        S T A T I C   M E T H O D S
 * *************************************************
 */

// Function to check if any document exits with the given id
schema.static('getById', function (value, projection = {}) {
    return Model.findOne({ _id: value }, projection)
})

// Function to check if any document exits with the given symbol
schema.static('getBySymbol', function (value, projection = {}) {
    return Model.findOne({ symbol: _.upperCase(value) }, projection)
})



/**
 * *************************************************
 *        I N S T A N C E   M E T H O D S
 * *************************************************
 */

const Model = dataStore.model('StockMetadata', schema)

module.exports = Model