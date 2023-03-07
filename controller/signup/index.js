const { userModal } = require('../connection')
exports.singUpValidation = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    const { user, email, pwd } = req.body
    const confirm = async () => {
        const isEmail = await userModal.findOne({ email })
        const isUser = await userModal.findOne({ user })
        if (isEmail) {
            res.status(409).json({
                status: false,
                massage: 'Email id already exists'
            })
            return
        }
        if (isUser) {
            res.status(409).json({
                status: false,
                massage: 'User id already exists'
            })
            return
        }
        if (!isEmail && !isUser) {
            next()
        }
    }
    confirm()
}
exports.Signup = (req, res) => {
    const { user, email, pwd } = req.body
    const DateModal = new userModal({
        user, email, pwd
    })
    DateModal.save()
    res.status(200).json({
        status: true,
        massage: "Registration Success"
    })
}