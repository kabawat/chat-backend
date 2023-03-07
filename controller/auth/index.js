const { userModal } = require('../connection')
const jwt = require('jsonwebtoken')
exports.verify = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    const token = req.headers.authorization
    try {
        const isValidUser = jwt.verify(token, process.env.PRIVETKEY)
        if (isValidUser) {
            userModal.findOne({ user: isValidUser.user }).then((result) => {
                next()
            })
        } else {
            throw false
        }
    } catch (error) {
        res.status(401).json({
            status: false,
            massage: 'invalid authentication credentials for the requested resource',
        })
    }
}

exports.userVerify = (req, res) => {
    const requestToken = req.headers.authorization
    const { user, email } = jwt.decode(requestToken)
    const token = jwt.sign({ user, email }, process.env.PRIVETKEY)
    try {
        if (token) {
            res.status(200).json({
                massage: 'success',
                status: true,
                status_code: 200,
                token
            })
        } else {
            throw false
        }
    } catch (error) {
        res.status(501).json({
            massage: 'internal server error',
            status: false,
        })
    }
}
