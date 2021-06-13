var jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('./../../config')

const verifyJwt = (headers) => {
    try {
        if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
            const token = headers.authorization.split(' ')[1];
            return jwt.verify(token, JWT_SECRET, { algorithm: 'HS256' })
        } else {
            throw Error("authorization token not found")
        }
    } catch (error) {
        throw error
    }
}

// the JWT auth check middleware
function signJwt(payload) {
    const { _id } = payload
    delete payload._id
    const token = jwt.sign(
        payload,
        JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: JWT_EXPIRY,
            subject: _id.toString()
        });
    return token;
}

module.exports = {
    signJwt,
    verifyJwt,
}