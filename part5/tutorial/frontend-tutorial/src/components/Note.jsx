import { useParams, useNavigate as navigate } from 'react-router-dom'

const Note = ({ note, toggleImportance, deleteNote }) => {
  const id = useParams().id
  if (!note) {
    return <div>Loading...</div>
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure do you want to delete ${note.content}`)) {
      deleteNote(id)
      navigate('/notes')
    }
  }

  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>
        {note.important ? 'make not important' : 'make important'}
      </button>
      <button type="button" onClick={handleDelete}>
        delete
      </button>
    </li>
  )
}

export default Note
