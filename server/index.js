// Dependencies
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// Make server
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())

// Routers

// Init DB
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Put server on listen to port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
