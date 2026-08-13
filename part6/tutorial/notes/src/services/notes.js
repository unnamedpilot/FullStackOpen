const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
    const response = await fetch(baseUrl)

    if (!response.ok) {
        throw new Error('failed to fetch notes')
    }

    return await response.json()
}

const createNew = async (content) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
    }

    const response = await fetch(baseUrl, options)

    if (!response.ok) throw new Error('failed to fetch notes')

    return await response.json()
}

const update = async (id, note) => {
    console.log(note)
    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(note)
    }

    const response = await fetch(`${baseUrl}/${id}`, options)

    if(!response.ok) {
        throw new Error('failed to fetch notes')
    }

    return response.json()
}

export default { getAll, createNew, update }