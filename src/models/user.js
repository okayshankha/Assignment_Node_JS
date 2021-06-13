const { SALT_ROUNDS } = require("../../config")
const bcrypt = require('bcrypt');
const dataStore = require('../core/dataStore');
const ObjectId = dataStore.ObjectId


const schemaDefinition = {
    firstName: { type: String, required: true },
    middleName: String,
    lastName: String,
    email: { type: String, required: true },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatarColor: String,
    stockSearchHistory: [{
        _stockMetadata: { type: ObjectId, ref: 'stockMetadata' },
        stock: {
            name: { type: String, required: true },
            symbol: { type: String, required: true },
        },
    }]
};

// e.g. we might want to pass in a second argument to the schema constructor
const schema = new dataStore.Schema(schemaDefinition, {
    autoIndex: true,
    versionKey: false,
    timestamps: true
})


// Before Save Hook
schema.pre('save', function (next) {
    const document = this

    // Hash password
    const { password } = document
    if (document.isModified('password')) {
        const hash = bcrypt.hashSync(password, SALT_ROUNDS)
        document.password = hash
    }
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

// Function to check if any document exits with the given email
schema.static('getByEmail', function (email) {
    return Model.findOne({ email })
})

// Function to generate the data for a new user
schema.static('register', async function (options) {
    const {
        firstName,
        middleName,
        lastName,
        password,
        email,
    } = options

    const user = new Model({
        firstName,
        middleName,
        lastName,
        password,
        email,
        avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
    })

    await user.save()

    return user
})




/**
 * *************************************************
 *        I N S T A N C E   M E T H O D S
 * *************************************************
 */

const Model = dataStore.model('User', schema)

module.exports = Model