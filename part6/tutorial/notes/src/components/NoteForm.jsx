import { useNoteActions } from "../store";

const NoteForm = () => {
  const { add } = useNoteActions();

  const addNote = async (e) => {
    e.preventDefault();
    const content = e.target.note.value;
    add(content);
    e.target.reset();
  };

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">submit</button>
    </form>
  );
};

export default NoteForm;
