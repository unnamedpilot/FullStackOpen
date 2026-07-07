const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const app = express()

mongoose.set('strictQuery', false)

logger.info('connecting to MongoDB database')

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info('connected to MongoDB'))
  .catch(error => logger.info(`an error happened when connection to MongoDB: ${error.message}`))

app.use(express.json())
app.use(express.static('dist'))

app.use(middleware.requestLogger)


app.use('/api/notes', notesRouter)


app.use(middleware.unknownEndpointHandler)

app.use(middleware.errorHandler)

module.exports = app
