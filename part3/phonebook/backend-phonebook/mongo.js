const mongoose = require("mongoose")

const args = process.argv.slice(2)

if (args.length === 0) {
    console.log("ERROR: password is required")
    process.exit(1)
}

const password = args[0]
const url = `mongodb+srv://danashswag_db_user:${password}@cluster0.ymk5bzu.mongodb.net`

mongoose.set("strictQuery", false)

mongoose.connect(url, {family: 4}).catch(err => {
    if (err.codeName === "AtlasError"){
        console.log("ERROR: incorrect password")
    }
    else{
        throw err
    }
    mongoose.connection.close()
    process.exit(1)
})



const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (args.length === 1) {
    Person
        .find({})
        .then(result => {
            console.log("phonebook")
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}
else if (args.length === 3) {
    const name = args[1]
    const number = args[2]
    Person
        .create({ name, number })
        .then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
            mongoose.connection.close()
        })
}
else {
    console.log("Something went wrong")
    mongoose.connection.close()
}






