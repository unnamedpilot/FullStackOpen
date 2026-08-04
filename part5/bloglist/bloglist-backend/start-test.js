require('dotenv').config()
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('./app')
const database = require('./utils/database')


const start = async () => {
    const memoryServer = await MongoMemoryServer.create()
    await database.connect(memoryServer.getUri())
    const PORT = 3003
    await app.listen(PORT, () => {
        console.log('Server is listening in test mode on', PORT)
    })
}

start()