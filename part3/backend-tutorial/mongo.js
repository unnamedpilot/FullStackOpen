const mongoose = require("mongoose")

const args = process.argv.slice(2)

console.log(args)


if (args.length === 0) {
    console.log("OPERATIONAL ERROR: include password as an argument")
    exit(0)
}

const password = args[0]

const dbUrl = `mongodb+srv://danashswag_db_user:${password}@cluster0.ymk5bzu.mongodb.net/?appName=Cluster0`

mongoose.set("strictQuery", false)
mongoose.connect(dbUrl, {family: 4})


const noteSchema = mongoose.Schema({
    content: String, 
    important: Boolean
})

const Note = mongoose.model("Note", noteSchema)

Note.find({})
    .then(result => {
        result.forEach(note => console.log(note))
    })
