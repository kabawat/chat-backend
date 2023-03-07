const { chatModal, userModal, socketModal } = require('../connection')

// create room 
exports.newchat = async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    const { sender, receiver } = req.body
    try {
        if (sender && receiver) {
            const sendUser = await userModal.findOne({ user: sender })
            const recUser = await userModal.findOne({ user: receiver })
            const socketData = await socketModal.findOne({ user: receiver })
            if (sendUser && recUser) {
                const isExist = await chatModal.findOne({ sender, receiver })
                if (isExist === null) {
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
                        massage: 'Chat created'
                    })
                } else {
                    throw new Error('chat Already exist')
                }

            } else {
                throw new Error('invalid credentials')
            }
        } else {
            throw new Error('invalid credentials')
        }
    } catch (error) {
        res.status(409).json({
            status_code: 409,
            status: false,
            data: {},
            massage: error.message
        })
    }
}

// fetch chat Data 
exports.chatList = (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
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