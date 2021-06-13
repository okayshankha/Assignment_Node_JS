const User = require("./../../models/user");
const responseHelper = require('./../../lib/responseHelper')

module.exports = {
    async me(req, res) {
        try {
            const { user: LoggedUser } = req

            const { email } = LoggedUser

            const user = await User.getByEmail(email)
            if (!user) {
                throw Error('Invalid User.')
            }

            return responseHelper(res, {
                message: 'Me fetch successful.',
                items: user
            })

        } catch (error) {
            return responseHelper(res, error, 'Error')
        }
    }
}