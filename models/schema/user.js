const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: Buffer,
        required: true
    },
    salt:{
        type: Buffer,
        required: true
    },
    email_verified:{
      type: Boolean,
      required: true,
      default: false
    },
    token:{
        type: String,
        default: null,
        required: false
    }
}, {timestamps: true})

module.exports = {
    User: mongoose.model('User', userSchema)
}