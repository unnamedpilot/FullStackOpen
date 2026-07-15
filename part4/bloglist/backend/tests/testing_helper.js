const Blog = require('../models/blog')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
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

module.exports = { blogsInDb, nonExistentId }