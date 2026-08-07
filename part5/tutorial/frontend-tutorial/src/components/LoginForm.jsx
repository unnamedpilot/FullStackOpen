import { useState } from 'react'
import loginService from '../services/login'
import noteService from '../services/notes'

const LoginForm = ({ setUser, showNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setUser(user)
      noteService.setToken(user.token)
      setUsername('')
      setPassword('')
      const notification = { text: `Logged in successfully as ${user.username}`, type: 'success' }
      showNotification(notification)
    } catch {
      const notification = { text: 'wrong credentials', type: 'error' }
      showNotification(notification)
    }
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm
