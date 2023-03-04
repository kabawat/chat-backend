const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv').config()
const userAuth = require('./router')
const server = http.createServer(app)
const socketIO = require('socket.io')
const port = process.env.PORT || 2917
const { socketModal } = require('./controller/connection')
app.use(express.json())
const corsOptions = {
    origin: "https://queryboat.netlify.app"
};
 
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://queryboat.netlify.app');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
const io = new socketIO.Server(server, {
    cors: {
        origin: 'https://queryboat.netlify.app',
        methods: ['GET', 'POST'],
        allowedHeaders: [
            'Content-Type',
        ]
        // setHeader:["Access-Control-Allow-Origin", "*"]
    }

})
app.use(userAuth)

server.listen(port, () => {
    console.log(`click here http://localhost:${port}`)
})

// socket data 
io.on('connection', socket => {
    socket.on('join', user => {
        socketDataHandal(socket, user)
    })
    socket.on('massage', data => {
        io.to(data.receiver.chatID).emit("reciveMsg", {
            ...data
        })
    })
    socket.on('updateSocket', profile => {
        profile && socketUpdate(socket, profile)
    })

    socket.on('refresh', data => {
        socketUpdate(socket, { user: data })
        socket.broadcast.emit('refreshed', data)
    })
})

const socketDataHandal = async (socket, user) => {
    const SocketData = new socketModal({
        [user]: socket.id,
        user: user
    })
    const responce = await SocketData.save()
}

const socketUpdate = async (socket, profile) => {
    if (profile) {
        await socketModal.replaceOne({ user: profile.user }, { [profile.user]: socket.id, user: profile.user })
    }
}