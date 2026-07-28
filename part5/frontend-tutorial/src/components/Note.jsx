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

export default Note