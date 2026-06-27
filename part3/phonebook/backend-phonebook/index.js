function generateId() {
    return parseInt(Math.random() * 1000000000000)
}

require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require("./models/persons")
const app = express()


app.use(express.json())
app.use(express.static("dist"))
app.use(morgan((tokens, request, response) => {
    const item = request.method === "POST" 
        ? JSON.stringify(request.body)
        : "" 

    return [
        tokens.method(request, response), 
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), "-",
        tokens["response-time"](request, response),
        item 
    ].join(' ')
}))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    Person.find({}).then(people => res.json(people))
})

app.get("/info", (req, res) => {
    const now = new Date()
    const html_file = `<p>Phonebook has info for ${persons.length}</p> 
        <p>${now.toString()}</p>`
    res.contentType("html").send(html_file)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if(person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    persons = persons.filter((person) => !(person.id === id))
    res.status(204).end()
})


app.post("/api/persons", (req, res) => {
    const body = req.body

    if(!body || !body.name || !body.number) {
       return res.status(400).json({error: "body must include name and number"})
    }

    const name = body.name
    const number = body.number


    Person.findOne({ name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(409).json({error: "That name is already registered"})
        }

        const person = new Person({name, number})
        person.save().then(savedPerson => {
            res.status(200).json(savedPerson)
        })
    })
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log(`The server is available in the PORT ${PORT}`)})
