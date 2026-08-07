import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const NoteForm = ({ onAddNote }) => {
  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault()
    const note = {
      content: newNote,
      important: true,
    }
    const isValid = await onAddNote(note)
    if (!isValid) {
      return
    }

    setNewNote('')
    navigate('/notes')
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="content"
          value={newNote}
          onChange={(event) => {
            setNewNote(event.target.value)
          }}
        ></TextField>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            submit
          </Button>
        </div>
      </form>
    </>
  )
}

export default NoteForm
