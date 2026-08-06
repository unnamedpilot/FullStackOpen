import { useState } from 'react'
import { Link } from 'react-router-dom'
import Notes from './Notes'

const NoteList = ({ notes }) => {
  const [showAll, setShowAll] = useState(true)

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <>
      <h1>Notes</h1>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default NoteList
