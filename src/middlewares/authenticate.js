const { verifyJwt } = require("../lib/jwtHelper")
const User = require("./../models/user");
const responseHelper = require('./../lib/responseHelper')

module.exports = {
    async authenticate(req, res, next) {
        try {
            const { headers } = req
            const { sub } = await verifyJwt(headers)
            if (sub) {
                const user = await User.getById(sub)
                if (!user) throw Error('Non-existing user id.')
                req.user = user
                return next()
            } else {
                throw Error('JWT is malformed.')
            }
        } catch (error) {
            return responseHelper(res, null, 'Unauthorized')
        }
    }
}