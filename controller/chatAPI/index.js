const { chatModal, userModal, socketModal } = require('../connection')

// create room 
exports.newchat = (req, res) => {
    const { sender, receiver } = req.body
    if (sender && receiver) {
        const findData = async () => {
            const sendUser = await userModal.findOne({ user: sender })
            const recUser = await userModal.findOne({ user: receiver })
            const socketData = await socketModal.findOne({ user: receiver })
            if (!sendUser || !recUser) {
                res.status(409).json({
                    status_code: 409,
                    status: false,
                    data: {},
                    msg: 'invalid credentials'
                })
            } else {
                const newChat = new chatModal({
                    chatID: socketData[receiver],
                    sender: sender,
                    receiver: receiver,
                })
                newChat.save()
                res.status(200).json({
                    status_code: 200,
                    status: true,
                    data: { ...req.body, chatID: socketData[receiver] },
                    msg: 'Chat created'
                })
            }
        }
        findData()
    } else {
        res.status(409).json({
            status_code: 409,
            status: false,
            data: {},
            msg: 'invalid credentials'
        })
    }
}

// fetch chat Data 
exports.chatList = (req, res) => {
    const getdata = async () => {
        const { sender } = req.query
        const chatsUsers = await chatModal.find({ sender })
        if (chatsUsers) {
            res.status(200).json({
                status_code: 200,
                status: true,
                data: chatsUsers,
                msg: 'fetch data Successfull'
            })
        } else {
            res.status(404).json({
                status_code: 404,
                status: false,
                data: chatsUsers,
                msg: 'data not found'
            })
        }
    }
    getdata()
}