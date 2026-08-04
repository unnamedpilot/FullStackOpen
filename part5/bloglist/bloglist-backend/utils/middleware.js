const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authHeader = request.get('Authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        request.token = authHeader.replace('Bearer ', '')
        return next()
    }
    request.token = null
    next()
}

const userExtractor = async (request, response, next) => {
    if(!request.token){
        return next()
    }
    const { id } = jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(id)
    next()
} 

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'CastError') {
        return response.status(400).json({ error: 'provided id is not valid' })
    } else if (error.name === 'MongoServerError', error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'username already in use' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' })
    }

    next(error)
}

module.exports = { errorHandler, tokenExtractor, userExtractor }