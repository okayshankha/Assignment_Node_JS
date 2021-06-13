const Joi = require('joi');

const schema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().allow(''),
    lastName: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().min(3).required(),
})

module.exports = {
    validate(payload) {
        const result = schema.validate(payload)
        return result
    }
}