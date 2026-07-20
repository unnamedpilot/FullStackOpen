const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../../app')
const supertest = require('supertest')
const { MongoMemoryServer } = require('mongodb-memory-server')
const database = require('../../utils/database')
const User = require('../../models/user')
const helper = require('./testing_helper')

let memoryServer

before(async () => {
    memoryServer = await MongoMemoryServer.create()
    await database.connect(memoryServer.getUri())
})

const api = supertest(app)

describe('user api', () => {
    describe('creating user', () => {
        test('requesting creation of user with valid data returns status code 201 and data', async () => {
            const userData = {
                username: 'Yusepe',
                name: 'Jhosep Ramirez',
                password: 'pepitoypablito'
            }

            const usersAtStart = await helper.usersInDb()

            await api
                .post('/api/users')
                .send(userData)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()

            assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        })

        test('requesting creation of user with no password returns status code 400', async () => {
            const userData = {
                username: 'Yusepe',
                name: 'Jhosep Ramirez',
            }

            const usersAtStart = await helper.usersInDb()

            const response = await api
                .post('/api/users')
                .send(userData)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            assert(response.body.error.includes('password is required'))

            const usersAtEnd = await helper.usersInDb()

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('requesting creation of user with no username returns status code 400', async () => {
            const userData = {
                name: 'Jhosep Ramirez',
                password: 'thiswillnotpass'
            }

            const usersAtStart = await helper.usersInDb()

            const response = await api
                .post('/api/users')
                .send(userData)
                .expect(400)
                .expect('Content-Type', /application\/json/)


            const usersAtEnd = await helper.usersInDb()

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('requesting creation of user with repeated username returns status 400 and proper message error', async () => {
            const userData = {
                username: 'Yusepe',
                name: 'Jhosep Ramirez',
                password: 'pepitoypablito'
            }

            const usersAtStart = await helper.usersInDb()

            const response = await api
                .post('/api/users')
                .send(userData)
                .expect(400)

            assert(response.body.error.includes('username already in use'))

            const usersAtEnd = await helper.usersInDb()

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

        test('creation of user with invalid username returns status 400', async () => {
            const userData = {
                username: 'Yu',
                name: 'Jhosep Ramirez',
                password: 'pepitoypablito'
            }

            const usersAtStart = await helper.usersInDb()

            const response = await api
                .post('/api/users')
                .send(userData)
                .expect(400)

            assert(response.body.error.includes('username must have 3 chars or more characters'))

            const usersAtEnd = await helper.usersInDb()

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })
        test('creation of password with password not enough long returns status 400', async () => {
            const userData = {
                username: 'Yusepe',
                name: 'Jhosep Ramirez',
                password: 'pe'
            }

            const usersAtStart = await helper.usersInDb()

            const response = await api
                .post('/api/users')
                .send(userData)
                .expect(400)

            assert(response.body.error.includes('password must have 3 chars or more characters'))

            const usersAtEnd = await helper.usersInDb()

            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        })

    })
    describe('viewing users', () => {
        beforeEach(async () => {
            await User.deleteMany({})
            await User.insertMany(helper.initialUsers)
        })

        test('GET /api/users returns all the users', async () => {
            const result = await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(result.body.length, helper.initialUsers.length)
            const sampledBlog = result.body[0].blogs
            assert.ok(sampledBlog, 'blogs field doesn\'t exist')
            
        })
    })
})

after(async () => {
    await database.disconnect()
    await memoryServer.stop()
})