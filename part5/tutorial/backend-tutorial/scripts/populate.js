const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const User = require('../models/user')
const Note = require('../models/note')

const MONGODB_URI = process.env.MONGODB_URI

async function populate() {
  await mongoose.connect(MONGODB_URI)

  // Optional: start with a clean database
  await Note.deleteMany({})
  await User.deleteMany({})

  // Create users
  const usersData = [
    {
      username: 'alice',
      name: 'Alice Johnson',
      password: 'secret123'
    },
    {
      username: 'bob',
      name: 'Bob Smith',
      password: 'password456'
    },
    {
      username: 'charlie',
      name: 'Charlie Brown',
      password: 'qwerty789'
    }
  ]

  const users = []

  for (const userData of usersData) {
    const passwordHash = await bcrypt.hash(userData.password, 10)

    const user = new User({
      username: userData.username,
      name: userData.name,
      passwordHash
    })

    await user.save()
    users.push(user)
  }

  // Create notes
  const notesData = [
    {
      content: 'Remember to buy groceries.',
      important: true,
      user: users[0]
    },
    {
      content: 'Finish the Full Stack Open exercises.',
      important: true,
      user: users[0]
    },
    {
      content: 'Read about MongoDB indexes.',
      important: false,
      user: users[1]
    },
    {
      content: 'Practice Node.js testing.',
      important: true,
      user: users[1]
    },
    {
      content: 'Review JavaScript promises.',
      important: false,
      user: users[2]
    },
    {
      content: 'Prepare for the backend interview.',
      important: true,
      user: users[2]
    }
  ]

  for (const noteData of notesData) {
    const note = new Note({
      content: noteData.content,
      important: noteData.important,
      user: noteData.user._id
    })

    const savedNote = await note.save()

    noteData.user.notes = noteData.user.notes.concat(savedNote._id)
    await noteData.user.save()
  }

  console.log('Database populated successfully.')

  await mongoose.connection.close()
}

populate().catch(error => {
  console.error(error)
  mongoose.connection.close()
})