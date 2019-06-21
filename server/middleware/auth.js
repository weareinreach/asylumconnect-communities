const jwt = require('jsonwebtoken')
const getJwtPrivateKey = require('../app/utils/authUtils').getJwtPrivateKey

function auth(req, res, next) {
    const token = req.cookies.auth_data
    if (!token) {
        req.user = { error: "Missing token" }
        next()
    }
    else {
        try {
            const privateKey = getJwtPrivateKey()
            const decode = jwt.verify(token, privateKey)
            req.user = decode
            next()
        }
        catch (ex) {
            req.user = { error: "Invalid token" }
            next()
        }
    }
}

module.exports = auth