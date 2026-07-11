const { MongoMemoryServer } = require('mongodb-memory-server')
const { test, before, after } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const database = require('../utils/database')

let memoryServer

before(async () => {
  memoryServer = await MongoMemoryServer.create()
  await database.connect(memoryServer.getUri())
})

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await database.disconnect()
  await memoryServer.stop()
})