
const Note = ({ note, toggleImportance }) => {

  return (
    <tr>
      <td className="note">
        {note.content}
      </td>
      <td>
        <button onClick={toggleImportance}>
          {note.important ? 'make not important' : 'make important'}
        </button>
      </td>
    </tr>
  )
}

const Notes = ({ notes, toggleImportance }) => {
  return (
    <table>
      <tbody>
        {notes.map((note) =>
          <Note
            note={note}
            key={note.id}
            toggleImportance={() => toggleImportance(note.id)}/>)}
      </tbody>
    </table>
  )
}

export default Notes