const app = require('./app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const database = require('./utils/database')
require('dotenv').config()

const start = async () => {
  console.log('Creating MongoMemoryServer...')
  const memoryServer = await MongoMemoryServer.create()

  console.log('Connecting...')
  await database.connect(memoryServer.getUri())

  await app.listen(3001)

  console.log('Server listening on 3001')
}

start()