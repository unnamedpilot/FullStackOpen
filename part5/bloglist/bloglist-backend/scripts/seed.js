require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

mongoose.set('strictQuery', false)

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create users
    const passwordHash1 = await bcrypt.hash('password123', 10)
    const passwordHash2 = await bcrypt.hash('secret456', 10)

    const user1 = await User.create({
      username: 'alice',
      name: 'Alice Johnson',
      passwordHash: passwordHash1
    })

    const user2 = await User.create({
      username: 'bob',
      name: 'Bob Smith',
      passwordHash: passwordHash2
    })

    // Create blogs
    const blogs = await Blog.insertMany([
      {
        title: 'Introduction to Node.js',
        author: 'Alice Johnson',
        url: 'https://example.com/node-intro',
        likes: 15,
        user: user1._id
      },
      {
        title: 'Understanding MongoDB',
        author: 'Alice Johnson',
        url: 'https://example.com/mongodb',
        likes: 8,
        user: user1._id
      },
      {
        title: 'Express Best Practices',
        author: 'Bob Smith',
        url: 'https://example.com/express',
        likes: 21,
        user: user2._id
      },
      {
        title: 'REST APIs with Mongoose',
        author: 'Bob Smith',
        url: 'https://example.com/rest-api',
        likes: 13,
        user: user2._id
      }
    ])

    // Update users with blog references
    user1.blogs = blogs
      .filter(blog => blog.user.toString() === user1._id.toString())
      .map(blog => blog._id)

    user2.blogs = blogs
      .filter(blog => blog.user.toString() === user2._id.toString())
      .map(blog => blog._id)

    await user1.save()
    await user2.save()

    console.log('Database seeded successfully')
  } catch (err) {
    console.error(err)
  } finally {
    await mongoose.connection.close()
    console.log('Connection closed')
  }
}

seed()