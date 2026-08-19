import { create } from "zustand";
import { devtools } from "zustand/middleware";
import noteService from './services/notes'

const initialNotes = [
  {
    id: 1,
    content: "Zustand is less complex than Redux",
    important: true,
  },
  {
    id: 2,
    content: "React app benefits from custom hooks",
    important: false,
  },
  {
    id: 3,
    content: "Remember to sleep well",
    important: true,
  },
];


const useNotesStore = create(devtools((set, get) => ({
  notes: initialNotes,
  filter: "all",
  actions: {
    add: async (content) => {
      const note = await noteService.createNew({ content })
      set((state) => ({ notes: [...state.notes, note] }))
    },
    toggleImportance: async (id) => {
      const note = get().notes.find(note => note.id === id)
      
      const updated = await noteService.update(id, { ...note, important: !note.important })

      set(state => ({notes: state.notes.map(note => note.id === id ? updated : note)}))
    },
    setFilter: (value) => set(() => ({ filter: value })),
    initialize: async () => {
      const notes = await noteService.getAll()
      set(() => ({ notes: notes }))
    },
  },
})));

export const useNotes = () => {
  const notes = useNotesStore(state => state.notes)
  const filter = useNotesStore(state => state.filter)
  if (filter === 'important') return notes.filter(note => note.important)
  else if (filter === 'nonimportant') return notes.filter(note => !note.important)
  return notes
}
export const useNoteActions = () => useNotesStore((state) => state.actions);
export const useFilter = () => useNotesStore((state) => state.filter)

export default useNotesStore
