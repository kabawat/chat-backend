const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 2917
const userAuth = require('./router')
const server = http.createServer(app)
const socketIO = require('socket.io')

const { socketModal } = require('./controller/connection')
app.use(express.json())

// Add CORS middleware with options
const corsOptions = {
  origin: "https://queryboat.netlify.app"
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }))

const io = new socketIO.Server(server, {
    cors: {
        origin: "https://queryboat.netlify.app",
        methods: ['GET', 'POST']
    }
})
app.use(userAuth)

// Add CORS header to response
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://queryboat.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

server.listen(port, () => {
    console.log(`click here http://localhost:${process.env.PORT}`)
})
