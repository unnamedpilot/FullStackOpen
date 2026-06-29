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



app.get("/api/persons", (req, res) => {
    Person
        .find({})
        .then(people => res.json(people))
        .catch(err => next(err))
})


app.get("/info", (req, res) => {
    const now = new Date()

    Person
        .find({})
        .then(persons => {
            const html_file = `<p>Phonebook has info for ${persons.length}</p> 
                <p>${now.toString()}</p>`
            res.contentType("html").send(html_file)
        })

    
})


app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person
        .findById(id)
        .then(person => {
            if(person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})


app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person
        .findByIdAndDelete(id)
        .then(deletedPerson => {
            res.status(204).json(deletedPerson)
        })
        .catch(err => next(err))
})


app.post("/api/persons", (req, res) => {
    const body = req.body

    if(!body || !body.name || !body.number) {
       return res.status(400).json({error: "body must include name and number"})
    }

    const name = body.name
    const number = body.number


    Person
        .findOne({ name })
        .then(existingPerson => {
            if (existingPerson) {
                return res.status(409).json({error: "That name is already registered"})
            }

            const person = new Person({name, number})
            person
                .save()
                .then(savedPerson => {
                    res.status(200).json(savedPerson)
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
})


app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id
    const body = req.body

    if(!body || !Object.hasOwn(body, "name") || !Object.hasOwn(body, "number")) {
        return res.status(400).json({error: "name and number are required"})
    }

    const { name, number } = body

    Person
        .findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }
            
            person.name = name
            person.number = number

            person
                .save()
                .then(updatedPerson => {
                    res.json(updatedPerson)
                })

        })
        .catch(err => next(err))
})



app.use((req, res) => {
    res.status(404).json({error: "unknown endpoint"})
})


const errorHandler = (err, req, res, next) => {
    console.log(err.message)

    if (err.name === "CastError") {
        res.status(400).json({error: "malformatted id"})
    }

    next(err)
}

app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log(`The server is available in the PORT ${PORT}`)})
