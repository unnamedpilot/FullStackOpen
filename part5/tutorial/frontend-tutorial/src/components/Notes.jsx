import Note from './Note'

const Notes = ({ notes, toggleImportance }) => {
  return (
    <table>
      <tbody>
        {notes.map((note) => (
          <Note
            note={note}
            key={note.id}
            toggleImportance={() => toggleImportance(note.id)}
          />
        ))}
      </tbody>
    </table>
  )
}

export default Notes
