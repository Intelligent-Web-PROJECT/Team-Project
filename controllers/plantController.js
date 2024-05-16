const {listNewPlant, findAllPlants, findAllPlantsByUserId, addComment} = require("../models/mongodb");
const {getLocation} = require("../public/javascripts/location");
const {sortItemsByDistance, calculateDistance} = require("../util/locationUtils");

function listPlant(req, res) {
    res.render('plant/list_plant',{})
}

async function postPlant(req, res) {
    try {

        const files = req.files
        const fileBase64 = []

        if(req.body.camera){
            console.log(req.body.camera)
            let camera = req.body.camera
            const matches = camera.match(/^data:(.+);base64,(.*)$/);
            if (!matches || matches.length !== 3) {
                throw new Error("Invalid base64 data");
            }
            const base64 = {
                img_type: matches[1], // This captures the MIME type
                img_data: Buffer.from(matches[2], 'base64')  // This captures the actual base64 buffer encoded data (without MIME type and prefix)

            }
            fileBase64.push(base64)
        }
        for (let i = 0; i < files.length; i++) {
            const image_data = Buffer.from(files[i].buffer, 'base64')
            const image_type = files[i].mimetype
            const base64Data = {img_type: image_type, img_data: image_data}

            fileBase64.push(base64Data)
        }
        console.log(fileBase64)


        const plant = await listNewPlant(req.body, fileBase64)

        console.log(plant)

        res.status(200).send(plant)

    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

async function syncPlant(req, res) {
    try {
        let plants = JSON.parse(req.body.data)
        const files = req.files
        const fileBase64 = []
        if(req.body.camera){
            console.log(req.body.camera)
            let camera = req.body.camera
            const matches = camera.match(/^data:(.+);base64,(.*)$/);
            if (!matches || matches.length !== 3) {
                throw new Error("Invalid base64 data");
            }
            const base64 = {
                img_type: matches[1], // This captures the MIME type (e.g., 'image/webp')
                img_data: Buffer.from(matches[2], 'base64')  // This captures the actual base64 buffer encoded data (without MIME type and prefix)

            }
            fileBase64.push(base64)
        }
        for (let i = 0; i < files.length; i++) {
            const image_data = Buffer.from(files[i].buffer, 'base64')
            const image_type = files[i].mimetype
            const base64Data = {img_type: image_type, img_data: image_data}

            fileBase64.push(base64Data)
        }
        console.log(fileBase64)
        let plant
        let updatedPlants = []
        for (const p of plants) {
            plant = await listNewPlant(req.user.id, p, fileBase64)
            updatedPlants.push(plant)
        }


        // console.log(plant)

        res.status(200).send(updatedPlants)

    } catch (error) {
        res.status(500).send(error)
    }
}

function getChats(req, res) {
    res.render('plant/plant_detail', {user: req.user, auth: req.isLoggedIn})
}

async function addMessage(req, res) {
    const plant = req.body.plant
    const nickname = req.body.nickname
    const text = req.body.text
    await addComment(plant, nickname, text)
}

async function getMyPlant(req, res) {
    try {
        const location = await getLocation()


        // const myPlants = await findAllPlantsByUserId(req.user.id);
        // myPlants.forEach(plant => {
        //     const distance = calculateDistance(location.latitude, location.longitude, plant.location.latitude, plant.location.longitude)
        //     console.log(distance)
        //     plant.distance = distance.toFixed(2)
        // })
        // res.render('plant/myPlants', {plants: myPlants});
    } catch (error) {
        console.log(error);
    }
}


async  function getAllPlants(req, res){
    try {
        let plants = await findAllPlants();
        const location = await getLocation()
        plants.forEach(plant => {
            const distance = calculateDistance(location.latitude, location.longitude, plant.location.latitude, plant.location.longitude)
            console.log(distance)
            plant.distance = distance.toFixed(2)
        })
        let message='';
        if (plants.length===0) {
            // res.render('plant/allPlants', { plants: [], message: "No plants found." });
            plants=[];
            message='No plants found.';
        } else {
            plants.forEach(plant => {
                if (plant.photo && plant.photo.img_data) {
                    plant.photoURL = `data:image/${plant.photo.img_type};base64,${plant.photo.img_data.toString('base64')}`;
                }
            });
        }
        res.render('plant/allPlants', { plants});
    } catch (error) {
        console.error('Error fetching all plants:', error);
    }
}

module.exports = {
    listPlant,
    postPlant,
    getChats,
    getMyPlant,
    getAllPlants,
    syncPlant,
    addMessage
}