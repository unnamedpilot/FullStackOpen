const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const database = require('../../utils/database')
const User = require('../../models/user')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../../app')
const helper = require('./testing_helper')
const bcrypt = require('bcrypt')
require('dotenv').config()

const api = supertest(app)
let memoryServer

const initialUser = {
    username: 'pepito',
    name: 'Pepe Florez',
    password: 'pepitoypablito'
}

before(async () => {
    memoryServer = await MongoMemoryServer.create()
    await database.connect(memoryServer.getUri())
    const { username, name, password } = initialUser
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ username, name, passwordHash })
})

describe('login api', () => {
    test('login with correct data returns status code 200 and jwt', async () => {
        const { username, password } = initialUser

        const response = await api
            .post('/api/login')
            .send({ username, password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const token = response.body.token
        assert.ok(token, 'the response doesn\'t have a token')
        assert.ok(token.length > 0, 'token is a empty string')

    })

    test('if password is incorrect, returns status 401 and proper message', async () => {
        const user = {
            username: initialUser.username,
            password: 'thiswontpass'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert.ok(response.body.error.includes('invalid username or password'))

    })

    test('if user doesn\'t exist, returns status 401 with proper message', async () => {
        const user = {
            username: 'randomuser',
            password: 'thiswontpass'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert.ok(response.body.error.includes('invalid username or password'))
    })  
})

after(async () => {
    await database.disconnect()
    await memoryServer.stop()
})