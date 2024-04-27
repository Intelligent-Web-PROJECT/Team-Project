const mongoose = require('mongoose')

const {User} = require('./schema/user')

const MONGO_HOST = process.env.MONGO_HOST || 'localhost'
const MONGO_USER = process.env.MONGO_USER || 'admin'
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_DBNAME = process.env.MONGO_DBNAME || 'test'
const MONGO_CONNAME = process.env.MONGO_CONNAME || 'mongodb'


const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DBNAME}?retryWrites=true&w=majority`

let connected = false


const connectToDB = async () => {
    await mongoose.connect(connectionString)

    const db = mongoose.connection

    db.on('error', (error) => console.error(error))
    db.once('open', async() => {
        console.log(`Connected to ${MONGO_CONNAME}`)
        connected = true
    })
}

if (process.env.ENVIRONMENT !== 'test') {
    connectToDB()
}

module.exports = {
    User,
    connected
}
