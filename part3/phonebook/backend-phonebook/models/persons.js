const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url, {family: 4}).then(result => {
    console.log("Successful connection to DB")
}).catch(err => {
    console.log("MongoDB error ocurred:", err.message)
})
mongoose.set("strictQuery", false)

const personSchema = mongoose.Schema({ 
      name: {
        type: String,
        minLength: 3
      }, 
      number: String
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
