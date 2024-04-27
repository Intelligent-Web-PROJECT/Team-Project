const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    description: {
        type: String
    },
    link: {
        type: String
    },
    height: {
        type: Number
    },
    spread: {
        type: Number
    },
    photo: {
        img_type: {
            type:String,
            required: true
        },
        img_data: {
            type: Buffer,
            required: true
        }
    },
    characteristics: {
        have_flowers: {
            type: Boolean
        },
        have_leaves: {
            type: Boolean
        },
        have_fruits: {
            type: Boolean
        },
        sun_exposure: {
            type: String
        },
        flower_colour: {
            type: String
        }
    },
}, { timestamps:true})

module.exports = {
    Plant: mongoose.model('Plant', plantSchema)
}