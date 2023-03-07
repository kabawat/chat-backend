const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketIO = require('socket.io')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get("/", (req, res) => {
    res.send("hello word")
})

app.post("/", (req, res) => {
    res.send(req.body)
})
server.listen(process.env.PORT, () => {
    console.log(`click here http://localhost:${process.env.PORT}`)
})
