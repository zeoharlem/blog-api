const mongoose = require('mongoose')
const config = require('../config/config')

function connectDatabase() {
    mongoose.connect(config.MONGO_URI)

    mongoose.connection.on("connected", () => {
        console.info('MongoDb connected successfully ✅')
    })

    mongoose.connection.on("error", (err) => {
        console.error("DatabaseConnectError:", err)
    })
}

module.exports = connectDatabase