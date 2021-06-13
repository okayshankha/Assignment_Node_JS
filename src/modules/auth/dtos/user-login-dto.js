const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(3).required(),
})

module.exports = {
    validate(payload) {
        const result = schema.validate(payload)
        return result
    }
}