const Blog = require('../../models/blog')
const User = require('../../models/user')

const initialBlogs = [
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

const initialUsers = [
    {
        username: "alicej",
        name: "Alice Johnson",
        passwordHash: "$2b$10$VQjXj0D7Q1X8uY9yL5m8qeQ8Q4lYlP1LQ2d5vQmM7XzK3J8oL9wXa",
    },
    {
        username: "marcos87",
        name: "Marcos Rivera",
        passwordHash: "$2b$10$kR4dLp7V2mN8QwY9H1sE0uD4fM6xA3nP8rL2bV7cT9jK5wZ1qX8Ye",
    },
    {
        username: "emilyw",
        name: "Emily White",
        passwordHash: "$2b$10$Bv9QmP5nL2kJ8sD3wF1zXeU7tH4aR6yN9cM0pL2qW5vJ8xK3nT1Ab",
    },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const blogsInUser = async (userId) => {
    const user = await User.findOne(userId).populate('blogs', ['_id','title','author','url'])
    
}

const nonExistentId = async () => {
    const blog = {
        title: "Building Scalable Express Applications",
        author: "Addy Osmani",
        url: "https://example.com/scalable-express",
        likes: 27,
    }
    const blogObject = new Blog(blog)
    await blogObject.save()
    await blogObject.deleteOne()
    return blogObject._id.toString()
}

module.exports = { blogsInDb, nonExistentId, usersInDb, initialBlogs, initialUsers }