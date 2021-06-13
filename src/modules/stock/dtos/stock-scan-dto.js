const Joi = require('joi');

const schema = Joi.object({
    symbol: Joi.string().required(),
    reScan: Joi.boolean().default(false)
})

module.exports = {
    validate(payload) {
        const result = schema.validate(payload)
        return result
    }
}