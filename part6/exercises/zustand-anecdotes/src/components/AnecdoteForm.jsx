import { useAnecdoteActions } from "../store";

const getId = () => (100000 * Math.random()).toFixed(0);

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();

  const addAnecdote = (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    const id = getId();
    const anecdote = {
      id,
      content,
      votes: 0,
    };
    add(anecdote);
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
