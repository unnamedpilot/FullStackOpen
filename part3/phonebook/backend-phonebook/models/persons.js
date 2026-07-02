const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url, {family: 4}).then(result => {
    console.log("Successful connection to DB")
}).catch(err => {
    console.log("MongoDB error ocurred:", err.message)
})
mongoose.set("strictQuery", false)

const validateNumberStructure = [
    {
        validator: (number) => /^\d+-\d+$/.test(number),
        message: "number must have only digits and one hyphen (-)"
    },
    {
        validator: (number) => number.split("-").length === 2, 
        message: "number must have one hyphen (-)"
    },
    {
        validator: (number) => {
            const firstSegment = number.split("-")[0]
            return firstSegment.length === 2 || firstSegment.length === 3
            
        },
        message: "first part of number must have between 2 and 3 chars"
    }
]

const personSchema = mongoose.Schema({ 
      name: {
        type: String,
        minLength: 3,
      }, 
      number: {
        type: String,
        minLength: 8,
        validate: validateNumberStructure
      }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
