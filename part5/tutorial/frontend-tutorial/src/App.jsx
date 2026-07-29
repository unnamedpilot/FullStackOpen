import { useState, useEffect } from 'react'
import Notes from './components/Notes'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteSection from './components/NoteSection'
import noteService from './services/notes'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    const user = JSON.parse(loggedUserJSON)
    return user
  })

  useEffect(() => {
    if (user) {
      noteService.setToken(user.token)
    }
  }, [user])

  const showNotification = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null))
  }

  const loginForm = () => {
    return (
      <>
        <Togglable buttonLabel='show login'>
          <LoginForm setUser={setUser} showNotification={showNotification} />
        </Togglable>
      </>
    )
  }

  const noteSection = () => {
    return (
      <>
        <p>{user.name} is logged in</p>
        <NoteSection showNotification={showNotification} />
      </>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && noteSection()}
      <Footer />
    </div>
  )
}

export default App
