const baseUrl = 'http://localhost:3003/anecdotes'

const getAll = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) throw new Error('fetch failed')
    return response.json()
}

const createNew = async (anecdote) => {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(anecdote)
    }

    const response = await fetch(baseUrl, options)
    if (!response.ok) throw new Error('fetch failed')
    return response.json()
}

const update = async(id, newAnecdote) => {
    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newAnecdote)
    }

    const response = await fetch(`${baseUrl}/${id}`, options)

    if (!response.ok) throw new Error('fetch failed')
    return response.json()
}

const remove = async (id) => {
    const options = {
        method: 'DELETE'
    }

    const response = await fetch(`${baseUrl}/${id}`, options)

    if (!response.ok) throw new Error('fetch failed')
    return response.json()

}

export default { getAll, createNew, update, remove }