const User = require('../models/user')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    const isPasswordValid = user === null
        ? false 
        : await bcrypt.compare(password, user.passwordHash)
    if(!isPasswordValid) {
        return response.status(401).json({error: 'invalid username or password'})
    }
    
    const userForToken = {
        username,
        id: user._id.toString()
    }
    
    const token = jwt.sign(userForToken, process.env.SECRET)
    response.status(200).json({ token, username: user.username, name: user.name })
    // response with the status 200, the token, the username and the name of the user.
})

module.exports = loginRouter