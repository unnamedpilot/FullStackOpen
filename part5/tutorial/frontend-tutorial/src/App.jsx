import { useState, useEffect, useRef } from 'react'
import { Link, Routes, Route, useMatch } from 'react-router-dom'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteList from './components/NoteList'
import NoteForm from './components/NoteForm'
import Home from './components/Home'
import noteService from './services/notes'
import Note from './components/Note'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    const user = JSON.parse(loggedUserJSON)
    return user
  })
  const [notes, setNotes] = useState([])
  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then((data) => setNotes(data))
  }, [])

  useEffect(() => {
    if (user) {
      noteService.setToken(user.token)
    }
  }, [user])

  const showNotification = (message) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), 5000)
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
        showNotification(
          `You can't modify the note with id ${id} because it doesn't exist`,
        )
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
    const data = await noteService.create(newNote)
    setNotes(notes.concat(data))
    noteFormRef.current.toggleVisibility()
  }

  const loginForm = () => {
    return (
      <>
        <Togglable buttonLabel="show login">
          <LoginForm setUser={setUser} showNotification={showNotification} />
        </Togglable>
      </>
    )
  }

  const noteList = () => {
    return (
      <>
        <p>{user.name} is logged in</p>
        <NoteList notes={notes} />
      </>
    )
  }

  const noteForm = () => {
    return (
      <>
        <Togglable buttonLabel="show notes" ref={noteFormRef}>
          <NoteForm onAddNote={handleAddNote} />
        </Togglable>
      </>
    )
  }

  const padding = { padding: 5 }

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null

  return (
    <div>
      <Notification message={errorMessage} />
      <div>
        <Link style={padding} to="/">
          home
        </Link>
        <Link style={padding} to="/login">
          log in
        </Link>
        <Link style={padding} to="/notes">
          notes
        </Link>
        <Link style={padding} to="/create">
          new note
        </Link>
      </div>
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
    </div>
  )
}

export default App
