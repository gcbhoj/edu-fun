require("dotenv").config();
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()
const port = process.env.PORT
const uri = process.env.ATLAS_URI;

app.use(express.json())
app.use(cors())


app.listen(port, () => {
    console.log(`Server running on port:${port}`)
})