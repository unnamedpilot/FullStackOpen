import axios from "axios"

const baseUrl = "/api/notes"
let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getData = (request) => request.then(response => response.data)

const getAll = () => {
    const request = axios.get(baseUrl)
    return getData(request)
}

const create = (newObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const request = axios.post(baseUrl, newObject, config)
    return getData(request)
}
const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return getData(request)
}

export default { getAll, create, update, setToken }