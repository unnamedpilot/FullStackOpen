const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { MongoMemoryServer } = require('mongodb-memory-server')
const database = require('../utils/database')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

let memoryServer

before(async () => {
  memoryServer = await MongoMemoryServer.create()
  await database.connect(memoryServer.getUri())
})

const api = supertest(app)

describe('user api', () => {
  describe('when there is initally one user in the db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('pablito', 10)
      const data = { username: 'pepito', passwordHash }

      const user = new User(data)
      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const userData = { username: 'marco', name: 'polo', password: 'superexcelente' }
      const usersAtStart = await helper.usersInDb()

      await api
        .post('/api/users')
        .send(userData)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(userData.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const user = {
        username: 'pepito',
        name: 'Pepe Grillo',
        password: 'nothing'
      }

      const usersAtStart = await helper.usersInDb()

      const response = await api
        .post('/api/users')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('expected `username` to be unique'))

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

  })
  describe('creating a new user', () => {
    beforeEach(async () => {
      await User.deleteMany({})
    })

    test('creation fails when username is not long enough (3 characters)', async () => {
      const user = {
        username: 'pe',
        name: 'lirilirilarila',
        password: 'peliriliri'
      }

      const usersAtStart = await helper.usersInDb()

      await api
        .post('/api/users')
        .send(user)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation fails when username have invalid characters (non-alphanumeric except underscore)', async () => {
      const user = {
        username: 'Pepito$%#',
        name: 'lirilirilarila',
        password: 'peliriliri'
      }

      const usersAtStart = await helper.usersInDb()

      await api
        .post('/api/users')
        .send(user)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
  })
})

after(async () => {
  await database.disconnect()
  await memoryServer.stop()
})
