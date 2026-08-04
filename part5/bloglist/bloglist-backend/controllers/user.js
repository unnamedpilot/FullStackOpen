const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if(!password) {
        return response.status(400).json({error: 'password is required'})
    } else if (password.length < 3) {
        return response.status(400).json({error: 'password must have 3 chars or more characters'})
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = { username, name, passwordHash }

    const result = await User.create(user)
    response.status(201).json(result)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', 'title author likes url')
    response.status(200).json(users)
})

module.exports = userRouter