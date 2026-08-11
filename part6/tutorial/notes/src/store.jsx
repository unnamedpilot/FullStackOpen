import { create } from "zustand";

const useNotesStore = create((set) => ({
  notes: [],
  actions: {
    add: (note) => set((state) => ({ notes: [...state.notes, note] })),
    toggleImportance: (id) =>
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, important: !note.important } : note,
        ),
      })),
  },
}));

export const useNotes = () => useNotesStore((state) => state.notes);
export const useNotesActions = () => useNotesStore((state) => state.actions);
