const logger = require('./utils/logger')
const express = require('express')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use(middleware.userExtractor, blogsRouter)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV == 'test') {
  console.log('entró')
  const testingRouter = require('./controllers/testing')
  app.use('/api/test', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app