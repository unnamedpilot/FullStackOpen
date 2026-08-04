const testingRouter = require('express').Router()
const User = require('../models/user')
const Blogs = require('../models/blog')
const bcrypt = require('bcrypt')

testingRouter.post('/reset', async (request, response) => {
    await User.deleteMany()
    await Blogs.deleteMany()
    response.status(204).end()
})

testingRouter.post('/blog', async (request, response) => {
    
    const passwordHash = await bcrypt.hash('esunsecreto', 10)
    const userData = {
        name: 'superadmin',
        username: 'admin',
        passwordHash
    }

    const user = await User.create(userData)
    const blogsData = [
        {
            title: "The Art of Refactoring",
            author: "Emily Carter",
            url: "https://example.com/refactoring-art",
            likes: 37,
            user: null
        },
        {
            title: "Building Scalable APIs",
            author: "James Wilson",
            url: "https://example.com/scalable-apis",
            likes: 184,
            user: null
        },
        {
            title: "Learning Rust the Hard Way",
            author: "Sophia Nguyen",
            url: "https://example.com/rust-hard-way",
            likes: 12,
            user: null
        },
        {
            title: "Mastering Distributed Systems",
            author: "Daniel Kim",
            url: "https://example.com/distributed-systems",
            likes: 91,
            user: null
        },
        {
            title: "Understanding Event Loops",
            author: "Lucas Brown",
            url: "https://example.com/event-loops",
            likes: 243,
            user: null
        },
        {
            title: "Clean Code Revisited",
            author: "Olivia Davis",
            url: "https://example.com/clean-code-revisited",
            likes: 58,
            user: null
        },
        {
            title: "Graph Databases Explained",
            author: "Noah Martinez",
            url: "https://example.com/graph-databases",
            likes: 7,
            user: null
        },
        {
            title: "Practical Kubernetes",
            author: "Ava Thompson",
            url: "https://example.com/practical-kubernetes",
            likes: 136,
            user: null
        },
        {
            title: "The Secrets of Caching",
            author: "Benjamin Lee",
            url: "https://example.com/secrets-caching",
            likes: 44,
            user: null
        },
        {
            title: "A Journey Through TypeScript",
            author: "Mia Anderson",
            url: "https://example.com/typescript-journey",
            likes: 209,
            user: null
        },
        {
            title: "Designing RESTful Services",
            author: "Ethan Walker",
            url: "https://example.com/restful-services",
            likes: 73,
            user: null
        },
        {
            title: "Algorithms for Everyday Developers",
            author: "Charlotte Harris",
            url: "https://example.com/everyday-algorithms",
            likes: 151,
            user: null
        }
    ]

    const userId = user._id

    const blogsDataWithUser = blogsData.map(blog => Object.assign(blog, { user: userId }))


    const returnedBlogs = await Blogs.insertMany(blogsData)
    response.status(201).end()
})

module.exports = testingRouter