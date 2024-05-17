const mongoose = require('mongoose')


// Plant sighting schema
const plantSchema = new mongoose.Schema({
    nickname: {
        type: String,
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
    date: {
      type: Date
    },
    location: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
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
    photos: [
        {
            img_type: {
                type:String,
                required: false
            },
            img_data: {
                type: Buffer,
                required: false
            }
        }
    ],
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