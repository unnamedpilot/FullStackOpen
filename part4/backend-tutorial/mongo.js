require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/user')
const Note = require('./models/note')


async function deleteAll() {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  await User.deleteMany({})
  await Note.deleteMany({})
}

deleteAll().then(async () => {
  const users = await User.find({})
  console.log('These are the documents in User:', users)
  const notes = await Note.find({})
  console.log('These are the documents in Note:', notes)
  await mongoose.connection.close()
})


