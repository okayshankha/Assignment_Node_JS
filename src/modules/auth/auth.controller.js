const UserRegistrationDTO = require("./dtos/user-register-dto")
const UserLoginDTO = require("./dtos/user-login-dto")

const bcrypt = require('bcrypt');

const responseHelper = require('./../../lib/responseHelper')
const User = require("./../../models/user");
const { signJwt } = require("../../lib/jwtHelper");

module.exports = {
    async login(req, res) {
        try {
            const { body } = req
            const { email, password } = body
            const validationResult = UserLoginDTO.validate(body)

            if (validationResult.error) {
                const { error } = validationResult
                return responseHelper(res, error, 'UnprocessableEntity')
            }

            const user = await User.getByEmail(email).select('_id firstName password')

            if (!user) {
                return responseHelper(res, "Invalid credentials.", 'Unauthorized')
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return responseHelper(res, "Invalid credentials.", 'Unauthorized')
            }

            const token = signJwt({
                firstName: user.firstName,
                _id: user._id
            })

            return responseHelper(res, token, 'LoginSuccess')

        } catch (error) {
            return responseHelper(res, error, 'Error')
        }
    },

    async register(req, res) {
        try {
            const { body } = req
            const { email } = body
            const validationResult = UserRegistrationDTO.validate(body)

            if (validationResult.error) {
                const { error } = validationResult
                return responseHelper(res, error, 'UnprocessableEntity')
            }

            const user = await User.getByEmail(email)
            if (user) {
                return responseHelper(res, "Email is taken", 'Conflict')
            }

            await User.register(body)

            return responseHelper(res, 'User registration successful.', 'Created')
        } catch (error) {
            return responseHelper(res, error, 'Error')
        }
    }
}