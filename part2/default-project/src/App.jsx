import { useState, useEffect } from "react"
import Notes from "./components/Notes"
import noteService from "./services/notes"

const App = () => {
  const [ notes, setNotes ] = useState([])
  const [ newNote, setNewNote ] = useState("...A new note")
  const [ showAll, setShowAll ] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(data => setNotes(data))
  }, [])

  

  const addNote = (event) => {
    event.preventDefault()
    const newRecord = {
      content: newNote,
      important: Math.random() < 0.5
    }
    
    noteService
      .create(newRecord)
      .then(data => {
        setNotes(notes.concat(data))
        setNewNote("")
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const element_address = notes.findIndex((note) => note.id === id)
    const note = notes[element_address]
    const changedNote = {...note, important: !note.important}
    
    noteService
    .update(id, changedNote)
    .then(data => {      
      setNotes((prevNotes) => prevNotes.map(note => note.id === data.id ? data : note))
    })
    .catch(() => {
      alert(`You can't modify the note with id ${id} because it doesn't exist`)
      const notesWithoutRejected = notes.filter((note) => note.id != id)
      setNotes(notesWithoutRejected)
    })
  }


  const notesToShow = showAll 
    ? notes 
    : notes.filter((note) => note.important)

  
  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "important" : "all"}
      </button>
      <Notes notes={notesToShow} toggleImportance={toggleImportanceOf}/>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">submit</button>
      </form>
    </div>
  )

}

export default App