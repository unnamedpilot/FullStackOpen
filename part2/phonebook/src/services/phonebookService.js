import axios from "axios"

const baseUrl = "http://localhost:3001/persons"

//getAll
const getAll = () => {
    return axios
      .get(baseUrl)
      .then(response => response.data)
}

//post
const create = (newObject) => {
   return axios
        .post(baseUrl, newObject)
        .then(response => response.data)
}

const remove = (id) => {
    const element_url = `${baseUrl}/${id}`
    return axios
        .delete(element_url)
}

const update = (id, newObject) => {
    const element_url = `${baseUrl}/${id}`
    return axios
        .put(element_url, newObject)
        .then(response => response.data)
}

export default { getAll, create, remove, update }