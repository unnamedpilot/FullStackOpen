const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()


blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const blog = new Blog({ ...request.body, user: user._id })

  await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  response.status(201).json(blog)
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  const id = request.params.id
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).end()
  }

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'unauthorized delete operation' })
  }

  await blog.deleteOne()
  user.blogs = user.blogs.filter(blogId => blogId.toString() !== id)
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const newBlog = request.body
  const id = request.params.id

  if (!newBlog || !Object.hasOwn(newBlog, 'likes')) {
    response.status(400).json({ error: '"likes" property it\'s required' })
  }

  newBlog.user = newBlog.user.id

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    newBlog,
    { returnDocument: 'after', runValidators: true }
  )

  if (!updatedBlog) {
    response.status(404).json({ 'error': `there is no document with id ${request.params.id}` })
  }

  const blog = await updatedBlog.populate('user', 'username name')


  response.status(200).json(blog)
})

module.exports = blogsRouter