const logger = require('./utils/logger')
const express = require('express')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())

app.use(blogsRouter)

app.use(middleware.errorHandler)

module.exports = app