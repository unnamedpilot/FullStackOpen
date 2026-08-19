import { describe, it } from 'vitest'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './anecdotesStore'
import { renderHook, act } from '@testing-library/react'

vi.mock('../services/notes', () => ({
    default: {
        getAll: vi.fn(),
        createNew: vi.fn(),
        update: vi.fn(),
        remove: vi.fn()
    }
}))

import noteService from '../services/notes'

beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
})

const initializeHook = (array) => {
    useAnecdoteStore.setState({ anecdotes: array })

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    const { result: actions } = renderHook(() => useAnecdoteActions())
    return { anecdotes, actions }
}

describe('useAnecdoteStore', () => {
    it('the state is initialized with the anecdotes returned by the backend', async () => {
        const mockAnecdotes = [
            {
                content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
                id: "36975",
                votes: 90
            },
            {
                content: "Premature optimization is the root of all evil.",
                id: "25170",
                votes: 22
            },
            {
                content: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
                id: "98312",
                votes: 28
            },
        ]
        noteService.getAll.mockResolvedValue(mockAnecdotes)
        const { result: notes } = renderHook(() => useAnecdotes())
        const { result: actions } = renderHook(() => useAnecdoteActions())

        await act(async () => {
            await actions.current.initialize()
        })

        assert.sameMembers(notes.current, mockAnecdotes)
    })

    it('the component displaying anecdotes receives the anecdotes from the store sorted by votes', async () => {
        const mockAnecdotes = [
            {
                content: "Premature optimization is the root of all evil.",
                id: "25170",
                votes: 22
            },
            {
                content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
                id: "36975",
                votes: 90
            },
            {
                content: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
                id: "98312",
                votes: 28
            },
        ]
        noteService.getAll.mockResolvedValue(mockAnecdotes)
        const { result: notes } = renderHook(() => useAnecdotes())
        const { result: actions } = renderHook(() => useAnecdoteActions())

        await act(async () => {
            await actions.current.initialize()
        })


        const isSortedByVotes = (array) => {

            let previous_value = array[0]

            for (const item of array) {

                if (previous_value.votes < item.votes) return false
                previous_value = item
            }
            return true
        }

        assert.sameMembers(notes.current, mockAnecdotes)
        expect(notes.current).toSatisfy(isSortedByVotes)
    })

    it('Component receives a properly filtered list of anecdotes.', async () => {
        const mockAnecdotes = [{
            "content": "If it hurts, do it more often",
            "id": "47145",
            "votes": 3
        },
        {
            "content": "Adding manpower to a late software project makes it later!",
            "id": "21149",
            "votes": 0
        },
        {
            "content": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
            "id": "69581",
            "votes": 1
        },]

        useAnecdoteStore.setState({ anecdotes: mockAnecdotes })

        const { result: anecdotes } = renderHook(() => useAnecdotes())
        const { result: actions } = renderHook(() => useAnecdoteActions())

        const setFilter = actions.current.setFilter

        await act(async () => await setFilter('If'))

        expect(anecdotes.current).toContainEqual(mockAnecdotes[0])

        await act(async () => await setFilter('project'))

        expect(anecdotes.current).toContainEqual(mockAnecdotes[1])

        await act(async () => await setFilter('90'))

        expect(anecdotes.current).toContainEqual(mockAnecdotes[2])

    })

    it('voting increases the number of votes for that anecdote', async () => {
        const mockAnecdotes = [{
            content: "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
            id: "69581",
            votes: 1
        },]
        noteService.update.mockImplementation((id, anecdote) => anecdote)

        const { anecdotes, actions } = initializeHook(mockAnecdotes)

  

        await act (async () => {
            await actions.current.vote(mockAnecdotes[0].id)
            await actions.current.vote(mockAnecdotes[0].id)
            await actions.current.vote(mockAnecdotes[0].id)
        })

        expect(anecdotes.current[0].votes).toBe(4)
    })
})