const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

const PORT = config.PORT || 3001
app.listen(PORT, () => logger.info(`The server is running in ${PORT}`))