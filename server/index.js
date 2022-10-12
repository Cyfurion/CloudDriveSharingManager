// Dependencies
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')


//make server
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

//middleware
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

//routers

//init db
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//put server on listen to port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
