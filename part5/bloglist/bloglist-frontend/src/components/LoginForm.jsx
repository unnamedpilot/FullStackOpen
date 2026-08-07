import { useState } from 'react'
import { TextField, Button, Paper } from '@mui/material'
import loginService from '../services/login'

const LoginForm = ({ updateLoggedUser, showNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      updateLoggedUser(user)
      setUsername('')
      setPassword('')
    } catch {
      const notificationObject = { text: 'wrong credentials', type:'error'  }
      showNotification(notificationObject)
    }
  }
  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="username"
            variant="standard"
          ></TextField>
        </div>
        <div>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="password"
            variant="standard"
          ></TextField>
        </div>
        <div style={{ paddingTop: 10 }}>
          <Button type="submit" variant="contained">
            LOGIN
          </Button>
        </div>
      </form>
    </>
  )
}

export default LoginForm
