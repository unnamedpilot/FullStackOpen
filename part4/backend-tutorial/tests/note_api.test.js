const { MongoMemoryServer } = require('mongodb-memory-server')
const { test, describe, before, after } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const database = require('../utils/database')
const Note = require('../models/note')
const logger = require('../utils/logger')

let memoryServer

before(async () => {
  memoryServer = await MongoMemoryServer.create()
  await database.connect(memoryServer.getUri())

  const notes = [
    {
      content: 'HTML is a markup language.',
      important: true,
    },
    {
      content: 'CSS controls the presentation of a webpage.',
      important: false,
    },
    {
      content: 'JavaScript can modify the DOM.',
      important: true,
    },
    {
      content: 'Node.js allows JavaScript to run outside the browser.',
      important: true,
    },
    {
      content: 'Express is a web framework for Node.js.',
      important: false,
    },
  ]

  try {
    logger.info('Inserting notes to Notes collection')
    await Note.insertMany(notes)
    logger.info('Notes inserted')

  } catch (error) {
    logger.error('Error inserting notes:', error.message)
    process.exit(1)
  }

})

const api = supertest(app)

describe('note api', () => {

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

})



after(async () => {
  await database.disconnect()
  await memoryServer.stop()
})