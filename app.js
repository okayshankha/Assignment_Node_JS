require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const responseHelper = require('./src/lib/responseHelper')

const restRoutes = require("./src/routes/restRoutes")


const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use('/', express.static('views'))


app.use(`/api`, restRoutes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    return responseHelper(res, Error('Route Not Found.'), 'NotFound')
})

// error handler
app.use((error, req, res, next) => {
    return responseHelper(res, error, 'Error')
})

module.exports = app
