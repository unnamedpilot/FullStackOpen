const logger = require('./logger')
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

logger.info('connecting to MongoDB database')


const connect = async (uri) => {

  await mongoose.connect(uri, { family: 4 })
  logger.info('connected to MongoDB')
}

const disconnect = async () => {
  await mongoose.connection.close()
}

module.exports = { connect, disconnect }