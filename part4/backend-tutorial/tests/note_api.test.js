const { MongoMemoryServer } = require('mongodb-memory-server')
const { test, describe, before, after, beforeEach } = require('node:test')
const helper = require('./test_helper')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const database = require('../utils/database')
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')

let memoryServer
let userId

before(async () => {
  memoryServer = await MongoMemoryServer.create()
  await database.connect(memoryServer.getUri())

})

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('wawaleke', 10)
  const user = await User.create({
    username: 'root',
    name: 'superadmin',
    passwordHash
  })
  userId = user._id
})

const api = supertest(app)

describe('note api', () => {

  describe('verifying groups of notes', () => {
    test('notes are returned as json', async () => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
      const response = await api.get('/api/notes')
      assert.strictEqual(response.body.length, helper.initialNotes.length)
    })

    test('a specific note is inside the returned notes', async () => {
      const data = await helper.notesInDb()
      const contents = data.map(note => note.content)
      const expected = 'JavaScript can modify the DOM.'
      assert.ok(contents.includes(expected), `there is not ${expected} when it should be`)
    })
  })

  describe('addition of a new note', () => {
    /**
     * If the userId of the note doesn't exist, it should return error 400
     * Note without userId is not allowed
     */
    test('a valid note can be added', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      const contentList = notesAtEnd.map(note => note.content)
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
      assert.ok(contentList.includes(newNote.content))
    })

    test('note without content is not added', async () => {
      const newNote = { important: true }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })

  })

  describe('viewing a specific note', () => {
    test('a specific note can be viewed', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]
      const result = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(result.body, noteToView)
    })
    test('when accessing a non existing id, return status 404', async () => {
      const nonExistentId = await helper.nonExistentId()
      await api
        .get(`/api/notes/${nonExistentId}`)
        .expect(404)
    })
    test('when accessing with a invalid id, return status 400', async() => {
      await api
        .get('/api/notes/1')
        .expect(400)
    })

  })

  describe('deletion of a note', () => {
    // It should also check that it's erased in the user list
    test('when deleting a note, this one dissapear from the db', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const ids = notesAtEnd.map(note => note.id)
      assert.ok(!ids.includes(noteToDelete.id))

      assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1)
    })

  })

})

after(async () => {
  await database.disconnect()
  await memoryServer.stop()
})