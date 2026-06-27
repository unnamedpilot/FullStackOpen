require("dotenv").config()
const Note = require("./models/note")
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

app.get("/api/notes", (request, response) => {
  Note
    .find({})
    .then(result => response.json(result))
})

app.get("/api/notes/:id", (request, response) => {
  let id = request.params.id
  let note = Note.findById(id).then(note =>{
    if(note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  
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

  const note = new Note({
    content: body.content,
    important: Boolean(body.important)
  })

  note.save().then(result => response.status(201).end())
  
})

app.use((request, response) => {
  response.status(404).json({error: "unknown endpoint"})
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`The server is running in ${PORT}`))