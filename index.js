const express = require('express')
const cors = require('cors')
const app = express()
// app.use(cors())
app.get("/", (req, res) => {
    res.send("hello word")
})
app.listen(process.env.PORT, () => {
    console.log(`click here http://localhost:${process.env.PORT}`)
})
