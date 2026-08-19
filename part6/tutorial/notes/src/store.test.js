import { renderHook, act } from '@testing-library/react'

vi.mock('./services/notes', () => ({
    default: {
        getAll: vi.fn(),
        createNew: vi.fn(),
        update: vi.fn()
    }
}))

import noteService from './services/notes'
import useNotesStore, { useNotes, useNoteActions } from './store'

beforeEach(() => {
    useNotesStore.setState({ notes: [], filter: '' })
    vi.clearAllMocks()
})

describe('useNotesActions', () => {
    it('initialize loads notes from service', async () => {
        const mockNotes = [{ id: 1, content: 'Test', important: false }]
        noteService.getAll.mockResolvedValue(mockNotes)

        const { result: notes } = renderHook(() => useNotes())
        const { result: actions } = renderHook(() => useNoteActions())

        expect(notes.current.length).toBe(0)

        await act(async () => await actions.current.initialize())

        expect(notes.current).toEqual(mockNotes)
    })

    it('add appends a new note', async () => {
        const newNote = { id: 2, content: 'New note', important: false }
        noteService.createNew.mockResolvedValue(newNote)

        const { result: actions } = renderHook(() => useNoteActions())
        const { result: notes } = renderHook(() => useNotes())

        await act(async () => await actions.current.add('New note'))

        expect(notes.current).toContainEqual(newNote)
    })

    it('toggleImportance flips important flag', async () => {
        const mockNote = {
            "id": "1",
            "content": "Zustand is less complex than Redux",
            "important": true
        }
        useNotesStore.setState({ notes: [mockNote] })

        noteService.update.mockImplementation((id, note) => ({ ...note, important: note.important }))

        const { result: actions } = renderHook(() => useNoteActions())
        const { result: notes } = renderHook(() => useNotes())

        await act(async () => await actions.current.toggleImportance(mockNote.id))

        console.log(notes.current)

        expect(notes.current[0].important).toBe(false)
    })
})
