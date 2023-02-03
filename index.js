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
app.use(cors({ 
    origin:'https://queryboat.netlify.app',
}))
app.use(express.urlencoded({ extended: true }))
const io = new socketIO.Server(server, {
    cors: {
         origin: "https://queryboat.netlify.app",
         methods: ["GET", "POST"],
         credentials: true
  }
})
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "https://www.differentServerDomain.fr https://www.differentServerDomain.fr");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
});

app.use(userAuth)
app.get("/", (req, res)=>{res.send("welcome to Query Boat")})
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
