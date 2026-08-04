import { useState } from 'react'

const NoteForm = ({ onAddNote }) => {
  const [newNote, setNewNote] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    const note = {
      content: newNote,
      important: true,
    }
    onAddNote(note)
    setNewNote('')
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          content
          <input
            value={newNote}
            onChange={(event) => {
              setNewNote(event.target.value)
            }}
          />
        </label>

        <button type="submit">submit</button>
      </form>
    </>
  )
}

export default NoteForm
