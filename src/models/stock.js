const dataStore = require('../core/dataStore')
const ObjectId = dataStore.ObjectId

const schemaDefinition = {
    _stockMetadata: { type: ObjectId, ref: 'stockMetadata' },
    stock: {
        name: { type: String, required: true },
        symbol: { type: String, required: true },
    },
    _user: { type: ObjectId, ref: 'user' },
    timestamp: { type: Date, required: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
    volume: { type: Number, required: true },
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
    return Model.findOne({ 'stock.symbol': _.upperCase(value) }, projection)
})



/**
 * *************************************************
 *        I N S T A N C E   M E T H O D S
 * *************************************************
 */

const Model = dataStore.model('Stock', schema)

module.exports = Model