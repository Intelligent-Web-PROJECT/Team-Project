const {listNewPlant} = require("../models/mongodb");
const {getLocation} = require("../public/javascripts/location");

function listPlant(req, res) {
    res.render('plant/list_plant',{user: req.user, auth: req.isLoggedIn})
}

async function postPlant(req, res) {
    try {

        const files = req.files
        const fileBase64 = []
        for (let i = 0; i < files.length; i++) {
            const image_data = Buffer.from(files[i].buffer, 'base64')
            const image_type = files[i].mimetype
            const base64Data = {img_type: image_type, img_data: image_data}

            fileBase64.push(base64Data)
        }

        const location = await getLocation()

        const plantLocation = {
            place: location.city +", "+ location.region,
            latitude: location.latitude,
            longitude: location.longitude
        }

        const plant = await listNewPlant(req.user.id, req.body, fileBase64, plantLocation)

        console.log(plant)

        res.status(200).send(plant)

    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

function getChats(req, res) {
    res.render('plant/plant_detail', {user: req.user, auth: req.isLoggedIn})
}

module.exports = {
    listPlant,
    postPlant,
    getChats
}