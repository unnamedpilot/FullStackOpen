const { before, beforeEach, after, test, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const database = require('../utils/database')
const Blog = require('../models/blog')
const helper = require('./testing_helper')

const blogs = [
    {
        title: "Clean Code in JavaScript",
        author: "Robert Martin",
        url: "https://example.com/clean-code-js",
        likes: 24,
    },
    {
        title: "Understanding Async/Await",
        author: "Jake Archibald",
        url: "https://example.com/async-await",
        likes: 42,
    },
    {
        title: "REST API Design Best Practices",
        author: "Roy Fielding",
        url: "https://example.com/rest-api-design",
        likes: 18,
    },
    {
        title: "Introduction to Node.js Testing",
        author: "Kent C. Dodds",
        url: "https://example.com/node-testing",
        likes: 31,
    },
    {
        title: "Mastering MongoDB",
        author: "Valeri Karpov",
        url: "https://example.com/mastering-mongodb",
        likes: 15,
    },
]

const api = supertest(app)

let memoryServer

before(async () => {
    memoryServer = await MongoMemoryServer.create()
    await database.connect(memoryServer.getUri())
    console.log("it already stopped")
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogsObject = blogs.map(blog => new Blog(blog))
    const promises = blogsObject.map(blogObject => blogObject.save())
    await Promise.all(promises)
})

describe('blogs api', () => {
    test('GET "/api/blogs" returns all objects in JSON format', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, blogs.length)
    })

    test('the blogs returned have id instead _id', async () => {
        const blogs = await api.get('/api/blogs')
        const isValidFormat = blogs.body.every(blog => Object.hasOwn(blog, 'id'))
        assert.ok(isValidFormat, 'The blogs have _id instead of id')
    })

    test('a valid note can be received', async () => {
        const newBlog = {
            title: "Building Scalable Express Applications",
            author: "Addy Osmani",
            url: "https://example.com/scalable-express",
            likes: 27,
        }

        const blogsAtStart = await helper.blogsInDb()

        response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
        const titles = blogsAtEnd.map(blog => blog.title)
        assert.ok(titles.find(title => title === newBlog.title), 'The new note title was not added')
    })

    test('if like property is missing, default to 0', async () => {
        const newBlog = {
            title: "Building Scalable Express Applications",
            author: "Addy Osmani",
            url: "https://example.com/scalable-express",
        }

        const result = await api
            .post('/api/blogs')
            .send(newBlog)

        assert.strictEqual(result.body.likes, 0)
    })

    test('if title is missing, return status code 400', async () => {
        const newBlog = {
            author: "Addy Osmani",
            url: "https://example.com/scalable-express",
            likes: 27,
        }

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })

    test('if url is missing, return status code 400', async () => {
        const newBlog = {
            title: "Building Scalable Express Applications",
            author: "Addy Osmani",
            likes: 27,
        }

        const blogsAtStart = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)

    })
})


after(async () => {
    await database.disconnect()
    await memoryServer.stop()
    console.log('stopped Correctly')
})

