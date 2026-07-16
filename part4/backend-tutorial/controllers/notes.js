const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('', async (request, response) => {
  const result = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(result)


})

notesRouter.get('/:id', async (request, response) => {

  let id = request.params.id
  const note = await Note.findById(id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

})

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Note.findByIdAndDelete(id)
  response.status(204).end()
})

notesRouter.post('', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)
  if (!user) {
    return response.status(400).json({ error: 'userId is missing or is invalid' })
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important),
    user: user._id
  })

  const result = await note.save()
  user.notes = user.notes.concat(note._id)
  await user.save()
  response.status(201).json(result)

})

notesRouter.put(':id', async (request, response) => {
  const body = request.body

  if (!body || !Object.hasOwn(body, 'content') || !Object.hasOwn(body, 'important')) {
    console.log(body.important)
    return response.status(400).json({ error: 'content and important is required' })
  }

  const { content, important } = body

  const result = await Note.findById(request.params.id)

  if (!result) {
    return response.status(404).end()
  }

  result.content = content
  result.important = important

  result.save().then(newNote => {
    response.json(newNote)
  })
})

module.exports = notesRouter