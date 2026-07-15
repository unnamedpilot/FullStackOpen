const mongoose = require('mongoose')
const logger = require('./logger')

const connect = async (uri) => {
    logger.info('connecting to mongodb database...')
    await mongoose.connect(uri, {family: 4})
    logger.info('connected to mongodb')
}

const disconnect = async () => {
    await mongoose.connection.close()
}

module.exports = { connect, disconnect }