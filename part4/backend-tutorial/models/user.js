const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    validate: {
      validator: (user) => /^\w+$/.test(user),
      message: 'The user name should only contain letters, numbers and underscore'
    }
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User