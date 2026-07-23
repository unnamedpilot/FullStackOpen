import { useEffect, useRef, useState } from 'react'
import noteService from '../services/notes'
import Notes from './Notes'
import Togglable from './Togglable'

const NoteSection = ({ showNotification }) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('...A new note')
  const [showAll, setShowAll] = useState(true)
  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then((data) => setNotes(data))
  }, [])

  const handleAddNote = (event) => {
    event.preventDefault()
    noteFormRef.current.toggleVisibility()
    const newRecord = {
      content: newNote,
      important: true,
    }

    noteService.create(newRecord).then((data) => {
      setNotes(notes.concat(data))
      setNewNote('')
    })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const element_address = notes.findIndex((note) => note.id === id)
    const note = notes[element_address]
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

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <>
      <Togglable buttonLabel='show notes' ref={noteFormRef}>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
        <Notes notes={notesToShow} toggleImportance={toggleImportanceOf} />
        <form onSubmit={handleAddNote}>
          <input value={newNote} onChange={handleNoteChange} />
          <button type="submit">submit</button>
        </form>
      </Togglable>
    </>
  )
}

export default NoteSection
