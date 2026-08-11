import { useNotesActions } from "../store";

const NoteForm = () => {
  const { add } = useNotesActions();

  const generateId = () => (Math.random * 1000000).toFixed(0);

  const addNote = (e) => {
    e.preventDefault();
    const content = e.target.note.value;
    const id = generateId();
    const note = { id, content, important: false };
    add(note);
    e.target.reset;
  };

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">submit</button>
    </form>
  );
};

export default NoteForm;
