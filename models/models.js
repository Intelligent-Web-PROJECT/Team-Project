const mongoose = require('mongoose')

const {User} = require('./schema/user')
const {Plant} = require('./schema/plant')

const MONGO_HOST = process.env.MONGO_HOST || 'localhost'
const MONGO_USER = process.env.MONGO_USER || 'admin'
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_DBNAME = process.env.MONGO_DBNAME || 'test'
const MONGO_CONNAME = process.env.MONGO_CONNAME || 'mongodb'


const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DBNAME}?retryWrites=true&w=majority`

let connected = false


const connectToDB = async () => {
    try {
        await mongoose.connect(connectionString)
            .then(() => {
                console.log(`connected to the ${MONGO_CONNAME}`)
            })
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        // Handle error (e.g., retry, log, notify)
    }
}

if (process.env.ENVIRONMENT !== 'test') {
    connectToDB()
}

module.exports = {
    User,
    Plant,
    connected
}
