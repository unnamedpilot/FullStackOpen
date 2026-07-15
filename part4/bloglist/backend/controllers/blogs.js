const Blog = require('../models/blog')
const blogsRouter = require('express').Router()


blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const newBlog = request.body

  if(!newBlog || !Object.hasOwn(newBlog, 'likes')) {
    response.status(400).json({error: '"likes" property it\'s required'})
  }

  const currBlog = await Blog.findById(request.params.id)

  if (!currBlog) {
    response.status(404).json({'error': `there is no document with id ${request.params.id}`})
  }
  currBlog.likes = newBlog.likes
  await currBlog.save()
  response.status(200).end()
})

module.exports = blogsRouter