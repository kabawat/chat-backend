const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()
const userAuth = require('./router')
const server = http.createServer(app)
const socketIO = require('socket.io')
const port = process.env.PORT || 2917
const { socketModal } = require('./controller/connection')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
const io = socketIO(server,{
    cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"]
},
maxHttpBufferSize: 1e8
})
  
app.use(cookieParser())
app.use(userAuth)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
server.prependListener("request", (req, res) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
});
server.listen(port, () => {
    console.log(`click here http://localhost:${port}`)
})

// socket data 
io.on('connection', socket => {
    socket.on('join', user => {
        socketDataHandal(socket, user)
        socket.broadcast.emit('joined', user)
    })
    socket.on('massage', data => {
        io.to(data.receiver.chatID).emit("reciveMsg", {
            ...data
        })
    })
    socket.on('updateSocket', profile => {
        profile && socketUpdate(socket, profile)
    })
})

const socketDataHandal = async (socket, user) => {
    const SocketData = new socketModal({
        [user]: socket.id,
        user: user
    })
    await SocketData.save()
}
const socketUpdate = async (socket, profile) => {
    await socketModal.replaceOne({ user: profile.user }, { [profile.user]: socket.id, user: profile.user })
}
