const {User, Plant} = require('./models')

const mongoose = require('mongoose')

async function insertUser() {
    try {
        const newUser = new User({
            username: 'Vinroy',
            email: 'vin@gmail.com',
            password: 'password'
        })
        const savedDevice = await newUser.save()
        return savedDevice._id
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    insertUser
}