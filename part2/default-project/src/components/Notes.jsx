
const Note = ({ note, toggleImportance }) => {
    
    return (
        <tr>
            <td>
                {note.content} 
            </td>
            <td>
                <button onClick={toggleImportance}>
                    Toggle importance
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