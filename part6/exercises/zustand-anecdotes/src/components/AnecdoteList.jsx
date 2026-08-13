import { useAnecdotes, useAnecdoteActions } from "../store/anecdotesStore";
import { useNotificationActions } from "../store/notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, remove } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes);

  const voteAnecdote = async (anecdote) => {
    await vote(anecdote.id);
    showNotification(`You voted '${anecdote.content}'`);
  };

  return (
    <>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
            <button onClick={() => remove(anecdote.id)}>delete</button>
          </div>
        </div>
      ))}
    </>
  );
};
export default AnecdoteList;
