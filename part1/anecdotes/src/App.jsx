import { useState } from 'react'

const Anecdote = ({title, anecdote, votes, onVote, onNext}) => {
  return (
    <div>
      <h1>{title}</h1>
      <div>{anecdote}</div>
      <div>
        {votes === 0 ? (
          <>No votes yet</>
        ) : (
          <>has {votes} votes</>
        )}
      </div>
      {onVote && <button onClick={onVote}>vote</button>}
      {onNext && <button onClick={onNext}>next anecdote</button>}
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleNextAnecdoteClick = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  const handleVoteClick = () => {
    setVotes(prevVotes => {
      const votesCopy = [...prevVotes]
      votesCopy[selected]+=1
      return votesCopy
      }
    )
  }

  const getMaxVotesLocation = () => {
    const max_votes = Math.max(...votes)
    return votes.indexOf(max_votes)
  }

  const maxVotesLocation = getMaxVotesLocation()

  return (
    <>
      <Anecdote
      title="Anecdote of the day"
      anecdote={anecdotes[selected]}
      votes={votes[selected]}
      onVote={handleVoteClick}
      onNext={handleNextAnecdoteClick}/>
      
      <Anecdote
      title="Anecdote with most votes"
      anecdote={anecdotes[maxVotesLocation]}
      votes={votes[maxVotesLocation]}/>
    </>
  )
}

export default App