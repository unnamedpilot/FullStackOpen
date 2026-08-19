
import { create } from 'zustand'
import noteService from '../services/notes'


const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find(anecdote => anecdote.id === id)
      const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
      const response = await noteService.update(id, newAnecdote)
      console.log('------------------------------------------------------', response)
      set(state => ({
        anecdotes: state.anecdotes.map(anecdote => {
          return anecdote.id === id ? response : anecdote})
      }))
    },
    add: async (content) => {
      const anecdoteData = { content, votes: 0 }
      const anecdote = await noteService.createNew(anecdoteData)
      set(state => ({ anecdotes: state.anecdotes.concat(anecdote) }))

    },
    setFilter: (text) => set(() => ({ filter: text })),
    initialize: () => {
      noteService
        .getAll()
        .then(data => set(() => ({ anecdotes: data })))
    },
    remove: async (id) => {
      await noteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id) }))
    }
  },
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.includes(filter))
  const sortedAnecdotes = filteredAnecdotes.toSorted((a , b) => b.votes - a.votes)
  //console.log(sortedAnecdotes)
  return sortedAnecdotes
}
export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore
