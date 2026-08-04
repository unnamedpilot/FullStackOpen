const { test, describe, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./testing_helper')
const User = require('../../models/user')
const Blog = require('../../models/blog')
const app = require('../../app')

const api = supertest(app)

const create_user_with_blogs = async (user, blogs) => {
    const newUser = new User(user)
    await newUser.save()

    const selected_blogs = blogs.map(blog => Object.assign(blog, { user: newUser._id }))
    const blogs_promises = blogs.map(blog => Blog.create(blog))
    const newBlogs = await Promise.all(blogs_promises)

    const blogs_ids = newBlogs.map(blog => blog._id)
    newUser.blogs.push(...blogs_ids)
    await newUser.save()
}

before(async () => {
    await helper.initializeMemoryServer()

})

describe('test api', () => {
    beforeEach(async () => {
        await Blog.deleteMany()
        await User.deleteMany()
        user = helper.initialUsers[0]
        blogs = helper.initialBlogs
        await create_user_with_blogs(user, blogs)
    })

    test('requests to /api/test/reset delete everything', async () => {
        await api
            .post('/api/test/reset')
            .expect(204)

        const userAtEnd = await helper.usersInDb()
        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(userAtEnd.length, 0)
        assert.strictEqual(blogsAtEnd.length, 0)
    })

    test.only('can create orphan blogs', async () => {
        await User.deleteMany()
        await Blog.deleteMany()

        const blogsAtStart = await helper.blogsInDb()
        assert(blogsAtStart.length === 0)

        const usersAtStart = await helper.usersInDb()
        assert(usersAtStart.length === 0)

        await api
            .post('/api/test/blog')
            .expect(201)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, 1)

        const blogsAtEnd = await helper.blogsInDb()
        assert(blogsAtEnd.length > 0)
    })
})

after(async () => {
    await helper.terminateMemoryServer()

})

