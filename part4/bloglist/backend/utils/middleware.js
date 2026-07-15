const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    } else if (error.name === 'CastError') {
        response.status(400).json({error: 'provided id is not valid'})
    }
    
    next(error)
}

module.exports = { errorHandler }