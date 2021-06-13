const Joi = require('joi');

const schema = Joi.object({
    symbol: Joi.string()
})

module.exports = {
    validate(payload) {
        const result = schema.validate(payload)
        return result
    }
}