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

app.get("/api/notes", (request, response, next) => {
  Note
    .find({})
    .then(result => response.json(result))
    .catch(err => {next(err)})
})

app.get("/api/notes/:id", (request, response, next) => {
  
  let id = request.params.id
  let note = Note.findById(id)
    .then(note =>{
      if(note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
  
})

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id
  Note
    .findByIdAndDelete(id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.post("/api/notes", (request, response, next) => {

  const body = request.body

  const note = new Note({
    content: body.content,
    important: Boolean(body.important)
  })

  note
    .save()
    .then(result => response.json(result))
    .catch(err => {
      next(err)
    })
  
})

app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body

  if(!body || !Object.hasOwn(body, "content") || !Object.hasOwn(body, "important")) {
    console.log(body.important)
    return response.status(400).json({error: "content and important is required"})
  }

  const { content, important } = body

  Note
    .findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }      

      note.content = content
      note.important = important

      note.save().then(newNote => {
        response.json(newNote)
      })
    })
    .catch(error => next(error))
})

app.use((request, response) => {
  response.status(404).json({error: "unknown endpoint"})
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message})
  }

  next(error)

}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`The server is running in ${PORT}`))