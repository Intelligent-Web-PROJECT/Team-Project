const mongoose = require('mongoose')

// Comment schema
const commentSchema = new mongoose.Schema({
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    comments: [
        {
            nickname: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            time: {
                type: Date,
                required: true
            }
        }
    ]
}, {timestamps: true})


module.exports = {
    Comment: mongoose.model('Comment', commentSchema)
}