const jwt = require('jsonwebtoken')
const { userModal, socketModal } = require('../connection')
exports.AllUser = (req, res) => {
    const getdata = async () => {
        const data = await userModal.find()
        const socketDB = await socketModal.find()
        const socketData = socketDB.map((value) => {
            const data = Object.keys(value)
            return data[3]
        })

        const filter = data.map((curElem, index) => {
            const curSocketUser = socketDB[index]
            const socketUser = socketData[index]
            const { _id, user, email } = curElem
            const result = {
                _id, user, email,
                [socketUser]: curSocketUser[socketData[index]]
            }
            return result
        })
        res.status(200).json(filter)
    }
    getdata()
}

exports.userProfile = (req, res) => {
    const requestToken = req.headers.authorization
    const data = jwt.decode(requestToken)
    if (data) {
        const getData = async () => {
            const result = await userModal.findOne({ user: data.user })
            const socketId = await socketModal.find({ user: data.user })
            const chatID = await socketId[0][data.user]
            const { _id, user, email } = result
            const profile = {
                _id,
                user,
                email,
                status: true,
                chatID
            }
            res.status(200).json(profile)
        }
        getData()
    } else {
        res.status(401).json({
            status_code: 401,
            status: false,
            data: {},
            msg: 'unauthorized'
        })
    }
}

exports.chatUserInfo = (req, res) => {
    const getData = async () => {
        const { email } = req.body
        const result = await userModal.findOne({ email })

        if (result) {
            const { email, user } = result
            res.status(200).json({
                status_code: 200,
                status: true,
                data: { email, user },
                msg: `let's chating with ${user}`
            })
        } else {
            res.status(404).json({
                status_code: 404,
                status: false,
                data: {},
                msg: 'Data not found'
            })
        }
    }
    getData()
}

exports.getReceiverProfile = (req, res) => {
    const getPofile = async () => {
        const { receiver } = req.query
        const profile = await userModal.findOne({ user: receiver })
        const UserSocket = await socketModal.findOne({ user: receiver })
        if (profile && UserSocket) {
            const { user, email } = profile
            res.status(200).json({
                status_code: 200,
                status: true,
                data: {
                    user,
                    email,
                    chatID: UserSocket[receiver]
                },
                msg: `let's chat with ${user}`
            })
        } else {
            res.status(404).json({
                status_code: 404,
                status: false,
                data: {},
                msg: 'Data not found'
            })
        }
    }
    getPofile()
}