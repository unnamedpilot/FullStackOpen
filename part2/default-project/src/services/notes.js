import axios from "axios"

const baseUrl = "http://localhost:3001/notes"

const getData = (request) => request.then(response => response.data)

const getAll = () => {
    const request = axios.get(baseUrl)
    const extraNote = {
      content: "This shouldn't exists",
      important: false,
      id: "1000000"
    }
    return getData(request).then(data => data.concat(extraNote))
}

const create = (newObject) => {
    const request = axios.post(baseUrl, newObject)
    return getData(request)
}
const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return getData(request)
}

export default { getAll, create, update }