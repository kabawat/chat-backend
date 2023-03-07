const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketIO = require('socket.io')

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cors())

server.get("/", (req, res) => {
    res.send("hello word")
})

server.post("/", (req, res) => {
    res.send(req.body)
})
server.listen(process.env.PORT, () => {
    console.log(`click here http://localhost:${process.env.PORT}`)
})
