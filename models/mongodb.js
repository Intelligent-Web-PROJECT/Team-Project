const {User, Plant} = require('./models')

const mongoose = require('mongoose')


async function getAllUsers() {
    return User.find();
}

async function getUserById(id) {
    return User.findOne({_id: id});
}

async function searchUser(filter) {
    return User.findOne(filter);
}

async function listNewPlant(user, plant, photos, location){
    try {

        const newPlant = new Plant({
            name: plant.name,
            user: user,
            description: plant.description,
            location: location,
            height: plant.height,
            spread: plant.spread,
            photos: photos,
            characteristics: {
                have_flowers: plant.flowers,
                have_leaves: plant.leaves,
                have_fruits: plant.fruits,
                sun_exposure: plant.sunExposure,
                flower_colour: plant.flowerColour
            }
        })

        return newPlant.save()

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    listNewPlant
}