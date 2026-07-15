const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')
const database = require('./utils/database')

database.connect(config.MONGODB_URI)

const PORT = 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
