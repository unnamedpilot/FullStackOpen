import { useAnecdoteActions } from "../store/anecdotesStore";
import { useNotificationActions } from "../store/notificationStore";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();

  const addAnecdote = (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    add(content);
    showNotification(`'${content}' has been added`)
    e.target.reset();
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="content" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
