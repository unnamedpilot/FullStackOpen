import { useState } from "react"
import Notes from "./components/Notes"

const App = ({ notes }) => {
  const [ notesState, setNotes ] = useState(notes)
  const [ newNote, setNewNote ] = useState("...A new note")
  const [ showAll, setShowAll ] = useState(true)

  const addNote = (event) => {
    event.preventDefault()
    console.log(event.target);
    const newRecord = {
      id: notesState.length + 1,
      content: newNote,
      important: Math.random() < 0.5
    }
    console.log(newRecord);
    
    setNotes((prevNotes) => prevNotes.concat(newRecord))
    setNewNote("")
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll 
    ? notesState 
    : notesState.filter((note) => note.important)

  
  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "important" : "all"}
      </button>
      <Notes notes={notesToShow}/>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">submit</button>
      </form>
    </div>
  )

}

export default App