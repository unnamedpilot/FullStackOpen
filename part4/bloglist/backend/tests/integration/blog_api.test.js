const { before, beforeEach, after, test, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const database = require('../../utils/database')
const Blog = require('../../models/blog')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const helper = require('./testing_helper')
require('dotenv').config()

const api = supertest(app)

let memoryServer


before(async () => {
    memoryServer = await MongoMemoryServer.create()
    await database.connect(memoryServer.getUri())
})

describe('blogs api', () => {

    describe('viewing blogs', () => {
        beforeEach(async () => {
            await Blog.deleteMany({})
            await User.deleteMany({})
            const user = await User.create(helper.initialUsers[0])
            const blogsToAdd = helper.initialBlogs.map(blog => Object.assign(blog, {user: user._id.toString()}))
            const blogsObject = helper.initialBlogs.map(blog => new Blog(blog))
            const promises = blogsObject.map(blogObject => blogObject.save())
            await Promise.all(promises)
        })

        test('GET "/api/blogs" returns all objects in JSON format and the user is populated', async () => {
            const response = await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.length, helper.initialBlogs.length)
            const sampledBlog = response.body[0]
            const userFieldKeys = Object.keys(sampledBlog.user)
            const requiredKeys = ['username', 'name', 'id']
            const isValidKeys = userFieldKeys.every(key => requiredKeys.includes(key))
            assert.ok(isValidKeys, 'Invalid user structure')
        })

        test('the blogs returned have id instead _id', async () => {
            const blogs = await api.get('/api/blogs')
            const isValidFormat = blogs.body.every(blog => Object.hasOwn(blog, 'id'))
            assert.ok(isValidFormat, 'The blogs have _id instead of id')
        })

    })

    describe('creating a blog', () => {
        let userId
        let authHeader
        before(async () => {
            await User.deleteMany()
            const user = await User.create(helper.initialUsers[0])
            userId = user._id
            const userForToken = {
                username: user.username,
                id: user._id.toString()
            }
            const token = jwt.sign(userForToken, process.env.SECRET)
            
            authHeader = `Bearer ${token}`
        })

        test.only('a valid note can be received', async () => {
            const newBlog = {
                title: "Building Scalable Express Applications",
                author: "Addy Osmani",
                url: "https://example.com/scalable-express",
                likes: 27,
            }

            const blogsAtStart = await helper.blogsInDb()

            response = await api
                .post('/api/blogs')
                .set('Authorization', authHeader)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

            const titles = blogsAtEnd.map(blog => blog.title)
            assert.ok(titles.find(title => title === newBlog.title), 'The new blog title was not added')

            const user = await User.findById(userId)
            assert.strictEqual(user.blogs.length, 1)

            const userBlogsIds = user.blogs.map(blogId => blogId.toString())
            assert.ok(userBlogsIds.includes(response.body.id), 'The added blog is not in the list of blog ids from user ')

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
                .set('Authorization', authHeader)

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
                .set('Authorization', authHeader)

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
                .set('Authorization', authHeader)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)

        })

        test('if there is no token, return status code 400 with proper message', async () => {
            const newBlog = {
                title: "Building Scalable Express Applications",
                author: "Addy Osmani",
                url: "https://example.com/scalable-express",
                likes: 27,
            }

            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            assert.ok(result.body.error.includes('invalid token'))
        })

        test('if token is not valid, return status code 400 with proper message', async () => {
            const falseUserId = await helper.nonExistentId()
            const newBlog = {
                title: "Building Scalable Express Applications",
                author: "Addy Osmani",
                url: "https://example.com/scalable-express",
                likes: 27,
                userId: falseUserId
            }

            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', '483')
                .expect(401)
                .expect('Content-Type', /application\/json/)

            assert.ok(result.body.error.includes('invalid token'))
        })

    })

    describe('deleting a blog', () => {
        let userId
        let authContent
        let blogId
        before(async () => {
            await User.deleteMany({})
            user = await User.create(helper.initialUsers[0])
            userId = user._id.toString()
            const userForToken = {
                username: user.username,
                id: userId
            }

            const token = jwt.sign(userForToken, process.env.SECRET)
            
            authContent = `Bearer ${token}`
        })

        beforeEach(async () => {
            await Blog.deleteMany({})
            const blogToInsert = helper.initialBlogs[0]
            blogToInsert.user = userId
            const blog = await Blog.create(blogToInsert)
            const user = await User.findById(userId)
            user.blogs = [blog._id]
            await user.save()
            blogId = blog._id.toString()
        })

        test('when deleting a note and the user is the owner, it dissapear from the db', async () => {
            const blogsAtStart = await helper.blogsInDb()

            await api
                .delete(`/api/blogs/${blogId}`)
                .set('Authorization', authContent)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

            const ids = blogsAtEnd.map(blog => blog.id)
            assert.ok(!ids.includes(blogId))

            const { blogs } = await User.findById(userId)
            const userBlogsIds = blogs.map(id => id.toString())
            assert.ok(!userBlogsIds.includes(blogId), 'the id of the deleted blog is in the user blog structure')

        })

        test('deleting a note but not being the owner returns status 401', async () => {
            const secondUser = await User.create(helper.initialUsers[1])
            const userForToken = {
                username: user.username,
                id: secondUser._id.toString()
            }

            const token = jwt.sign(userForToken, process.env.SECRET)
            
            secondAuthContent = `Bearer ${token}`
            const blogsAtStart = await helper.blogsInDb()

            await api
                .delete(`/api/blogs/${blogId}`)
                .set('Authorization', secondAuthContent)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

            const ids = blogsAtEnd.map(blog => blog.id)
            assert.ok(ids.includes(blogId))

            const { blogs } = await User.findById(userId)
            const userBlogsIds = blogs.map(id => id.toString())
            assert.ok(userBlogsIds.includes(blogId), 'the id of the deleted blog is in the user blog structure')
        })

        test('when deleting a note with a non-existent id, return 404', async () => {
            const nonExistentId = await helper.nonExistentId()
            const blogsAtStart = await helper.blogsInDb()
            await api
                .delete(`/api/blogs/${nonExistentId}`)
                .set('Authorization', authContent)
                .expect(404)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
        })

        test('when deleting a note with an invalid ID, return status 400', async () => {
            await api
                .delete(`/api/blogs/1`)
                .set('Authorization', authContent)
                .expect(400)
        })
    })

    describe('updating a blog record', () => {
        test('updating an element make it change in the db', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
            blogToUpdate.likes += 1


            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(blogToUpdate)
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()
            const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
            assert.deepStrictEqual(blogToUpdate, updatedBlog)
        })

        test('updating an element with a invalid Id returns 404', async () => {
            const testBlog = {
                title: "Building Scalable Express Applications",
                author: "Addy Osmani",
                url: "https://example.com/scalable-express",
                likes: 27,
            }
            const nonExistingId = await helper.nonExistentId()
            await api
                .put(`/api/blogs/${nonExistingId}`)
                .send(testBlog)
                .expect(404)
        })

        test('updating an element without likes returns 400', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogBefore = blogsAtStart[0]
            await api
                .put(`/api/blogs/${blogBefore.id}`)
                .send({})
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            const blogAfter = blogsAtEnd.find(blog => blog.id === blogBefore.id)
            assert.deepStrictEqual(blogBefore, blogAfter)
        })
    })




})


after(async () => {
    await database.disconnect()
    await memoryServer.stop()
})

