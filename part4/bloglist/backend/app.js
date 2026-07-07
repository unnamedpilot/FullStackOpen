const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = MONGODB_URI

logger.info('connecting to MongoDB database...')

mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => logger.info('connected to MongoDB'))
  .catch(error => logger.info('connection failed because error:', error.message))


app.use(express.json())

app.use(blogsRouter)

module.exports = app