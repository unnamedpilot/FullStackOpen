const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        minLength: [3, 'username must have 3 chars or more characters'],
        unique: true,
        required: true
    },
    name: String,
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [{
        ref: 'Blog',
        type: mongoose.Schema.Types.ObjectId
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