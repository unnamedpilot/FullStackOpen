const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is a markup language.',
    important: true,
  },
  {
    content: 'CSS controls the presentation of a webpage.',
    important: false,
  },
  {
    content: 'JavaScript can modify the DOM.',
    important: true,
  },
  {
    content: 'Node.js allows JavaScript to run outside the browser.',
    important: true,
  },
  {
    content: 'Express is a web framework for Node.js.',
    important: false,
  },
]

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const nonExistentId = async () => {
  const note = new Note({ content: 'nothing' })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

module.exports = { initialNotes, notesInDb, nonExistentId }
