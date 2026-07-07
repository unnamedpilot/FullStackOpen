const info = (...parameters) => {
    console.log(...parameters)
}
const error = (...parameters) => {
    console.error (...paramenters)
}

module.exports = { info, error }