import { useEffect, useRef, useState } from 'react'
import noteService from '../services/notes'
import Notes from './Notes'
import NoteForm from './NoteForm'
import Togglable from './Togglable'

const NoteSection = ({ showNotification }) => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then((data) => setNotes(data))
  }, [])

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

  const handleAddNote = async (newNote) => {
    const data = await noteService.create(newNote)
    setNotes(notes.concat(data))
    noteFormRef.current.toggleVisibility()
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
      <Notes notes={notesToShow} toggleImportance={toggleImportanceOf} />
      <Togglable buttonLabel="show notes" ref={noteFormRef}>
        <NoteForm onAddNote={handleAddNote} />
      </Togglable>
    </>
  )
}

export default NoteSection
