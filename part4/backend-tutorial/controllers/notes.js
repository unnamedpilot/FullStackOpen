const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('', (request, response, next) => {
  Note
    .find({})
    .then(result => response.json(result))
    .catch(err => {next(err)})
})

notesRouter.get('/:id', (request, response, next) => {

  let id = request.params.id
  Note.findById(id)
    .then(note => {
      if(note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))

})

notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Note
    .findByIdAndDelete(id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

notesRouter.post('', (request, response, next) => {

  const body = request.body

  const note = new Note({
    content: body.content,
    important: Boolean(body.important)
  })

  note
    .save()
    .then(result => response.json(result))
    .catch(err => {
      next(err)
    })

})

notesRouter.put(':id', (request, response, next) => {
  const body = request.body

  if(!body || !Object.hasOwn(body, 'content') || !Object.hasOwn(body, 'important')) {
    console.log(body.important)
    return response.status(400).json({ error: 'content and important is required' })
  }

  const { content, important } = body

  Note
    .findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      note.save().then(newNote => {
        response.json(newNote)
      })
    })
    .catch(error => next(error))
})

module.exports = notesRouter