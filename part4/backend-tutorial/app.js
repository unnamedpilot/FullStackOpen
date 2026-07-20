const express = require('express')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const app = express()


app.use(express.json())

app.use(express.static('dist'))

app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpointHandler)

app.use(middleware.errorHandler)

module.exports = app
