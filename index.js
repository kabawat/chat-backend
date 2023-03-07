const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const port = process.env.PORT || 2917
const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
})

io.on("connection", socket => {
    socket.on('join', data => {
        console.log("data : ", data)
    })
})

app.get("/", (req, res) => {
    res.send({
        massage: "hello word ",
        port: process.env.PORT
    })
})

app.post("/", (req, res) => {
    res.send(req.body)
})
server.listen(port, () => {
    console.log(`click here http://localhost:${process.env.PORT || 2917}`)
})
