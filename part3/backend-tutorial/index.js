const cors = require("cors")
const express = require("express")
const app = express()

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

function generateId(notes) {
  if (notes.length > 0) {
    const ids = notes.map((note) => parseInt(note.id))
    return Math.max(...ids) + 1
  }
  return 0
}

app.use(express.json())
app.use(express.static("dist"))
app.use((request, response, next) => {
  console.log("Method: ", request.method)
  console.log("Path: ", request.path)
  console.log("Body: ", request.body)
  console.log("---")
  next()
})

app.get("/", (request, response) => response.send("<h1>Hello World</h1>"))

app.get("/api/notes", (request, response) => response.json(notes))

app.get("/api/notes/:id", (request, response) => {
  let id = request.params.id
  let note = notes.find((n) => n.id === id)
  if(note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id
  notes = notes.filter((n) => !(n.id === id))
  response.status(204).end()
})

app.post("/api/notes", (request, response) => {

  const body = request.body
  if (!body.content) {
    return response.status(400).json({
      error: "The request doesn't have any content in the body"
    })
  }

  const content = body.content
  const important = Boolean(body.important)
  const id = generateId(notes)

  const new_note = { id, content, important }

  notes.concat(new_note)

  response.status(201).end()
})

app.use((request, response) => {
  response.status(404).json({error: "unknown endpoint"})
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`The server is running in ${PORT}`))