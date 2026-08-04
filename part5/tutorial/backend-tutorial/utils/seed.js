const bcrypt = require('bcrypt')
const User = require('../models/user')
const Note = require('../models/note')

const seedDatabase = async () => {
  // Remove existing data
  await User.deleteMany({})
  await Note.deleteMany({})

  // Create users
  const passwordHash = await bcrypt.hash('secret', 10)

  const user1 = new User({
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    passwordHash
  })

  const user2 = new User({
    username: 'john_doe',
    name: 'John Doe',
    passwordHash
  })

  await user1.save()
  await user2.save()

  // Create notes
  const note1 = new Note({
    content: 'HTML is easy',
    important: true,
    user: user1._id
  })

  const note2 = new Note({
    content: 'MongoDB stores documents',
    important: false,
    user: user1._id
  })

  const note3 = new Note({
    content: 'Node.js runs JavaScript',
    important: true,
    user: user2._id
  })

  await note1.save()
  await note2.save()
  await note3.save()

  // Update references
  user1.notes = [note1._id, note2._id]
  user2.notes = [note3._id]

  await user1.save()
  await user2.save()
}

module.exports = seedDatabase