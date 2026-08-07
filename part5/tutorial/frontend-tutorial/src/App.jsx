import { useState, useEffect } from 'react'
import { Link, Routes, Route, useMatch } from 'react-router-dom'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import NoteList from './components/NoteList'
import NoteForm from './components/NoteForm'
import Home from './components/Home'
import noteService from './services/notes'
import Note from './components/Note'
import { Container, AppBar, Toolbar, Button } from '@mui/material'

const App = () => {
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    const user = JSON.parse(loggedUserJSON)
    return user
  })
  const [notes, setNotes] = useState([])

  useEffect(() => {
    noteService.getAll().then((data) => setNotes(data))
  }, [])

  useEffect(() => {
    if (user) {
      noteService.setToken(user.token)
    }
  }, [user])

  const showNotification = (notification) => {
    setNotification(notification)
    setTimeout(() => setNotification(null), 5000)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((data) => {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === data.id ? data : note)),
        )
      })
      .catch(() => {
        const message = {
          text: `You can't modify the note with id ${id} because it doesn't exist`,
          type: 'error',
        }
        showNotification(message)
        const notesWithoutRejected = notes.filter((note) => note.id !== id)
        setNotes(notesWithoutRejected)
      })
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      const filteredNotes = notes.filter((note) => note.id !== id)
      setNotes(filteredNotes)
    })
  }

  const handleAddNote = async (newNote) => {
    try {
      const data = await noteService.create(newNote)
      setNotes(notes.concat(data))
      const notification = {
        text: `${data.content} was added`,
        type: 'success',
      }
      showNotification(notification)
      return true
    } catch (error) {
      if (error.status === 400) {
        const message = { text: error.response.data.error, type: 'error' }
        showNotification(message)
        return false
      }
      throw error
    }
  }

  const loginForm = () => {
    if (user) {
      return <div>Already logged as {user.name}</div>
    }
    return (
      <>
        <LoginForm setUser={setUser} showNotification={showNotification} />
      </>
    )
  }

  const noteList = () => {
    return (
      <>
        <NoteList notes={notes} />
      </>
    )
  }

  const noteForm = () => {
    return (
      <>
        <NoteForm onAddNote={handleAddNote} />
      </>
    )
  }

  const match = useMatch('/notes/:id')
  const note = match ? notes.find((note) => note.id === match.params.id) : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>
            home
          </Button>
          <Button color="inherit" component={Link} to="/login" sx={style}>
            log in
          </Button>
          <Button color="inherit" component={Link} to="/notes" sx={style}>
            notes
          </Button>
          <Button color="inherit" component={Link} to="/create" sx={style}>
            new note
          </Button>
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={loginForm()} />
        <Route path="/notes" element={noteList()} />
        <Route path="/create" element={noteForm()} />
        <Route
          path="/notes/:id"
          element={
            <Note
              note={note}
              toggleImportance={toggleImportanceOf}
              deleteNote={deleteNote}
            />
          }
        />
      </Routes>
      <Footer />
    </Container>
  )
}

export default App
