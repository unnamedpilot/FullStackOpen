import { useState, useEffect } from "react"
import Notes from "./components/Notes"
import axios from "axios"

const App = () => {
  const [ notes, setNotes ] = useState([])
  const [ newNote, setNewNote ] = useState("...A new note")
  const [ showAll, setShowAll ] = useState(true)

  useEffect(() => {
    console.log("effect")
    axios
      .get("http://localhost:3001/notes")
      .then(response => {
        console.log("promise fulfilled");
        setNotes(response.data)})
  }, [])

  console.log("render", notes.length, "notes")
  

  const addNote = (event) => {
    event.preventDefault()
    console.log(event.target);
    const newRecord = {
      id: notes.length + 1,
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
    ? notes 
    : notes.filter((note) => note.important)

  
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