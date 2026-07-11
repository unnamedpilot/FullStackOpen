const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')
const database = require('./utils/database')

database.connect(config.MONGODB_URI)

const PORT = config.PORT || 3001
app.listen(PORT, () => logger.info(`The server is running in ${PORT}`))