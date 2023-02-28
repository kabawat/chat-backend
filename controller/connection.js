const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
mongoose.connect(process.env.BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const SchemaModal = new mongoose.Schema({
    user: {
        type: String,
        require,
    },
    email: {
        type: String,
        require
    },
    pwd: {
        type: String,
        require
    },
    date: {
        type: Date,
        default: Date.now
    },
})

// user Chat table 
const chatTable = new mongoose.Schema({
    chatID: {
        type: String,
        require
    },
    sender: {
        type: String,
        require
    },
    receiver: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const chatSocket = new mongoose.Schema({}, { strict: false })

const userModal = new mongoose.model('userDetaile', SchemaModal)
const chatModal = new mongoose.model('chatList', chatTable)
const socketModal = new mongoose.model('socketIds', chatSocket)
module.exports = { userModal, chatModal, socketModal }
