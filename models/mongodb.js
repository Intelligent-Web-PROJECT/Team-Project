const {User, Plant, Comment} = require('./models')

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
            location: {
                latitude: plant.latitude,
                longitude: plant.longitude
            },
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

// Function to find all plants by a specific user ID
async function findAllPlantsByUserId(userId) {
    return Plant.find({ user: userId }).populate('user', 'username'); // Populate user details
}

// Function to find all plants in the database
async function findAllPlants() {
    return Plant.find().populate('user', 'username'); // Populate user details
}

async function addComment(plantId, userId, commentText) {
    try {
        const existingComment = await Comment.findOne({plant: plantId})
        if (!existingComment) {
            const newComment = new Comment({
                plant: plantId,
                comments: [{
                    user: userId,
                    text: commentText,
                    time: Date.now()
                }]
            })
            await newComment.save()
        } else {
            existingComment.comments.push({
                user: userId,
                text: commentText,
                time: Date.now()
            })
            await existingComment.save()
        }
    }catch (error) {
        console.log(error)
    }
}

async function getComments(plantId) {
    return await Comment.findOne({plant: plantId})
}


module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    listNewPlant,
    findAllPlantsByUserId,
    findAllPlants,
    addComment,
    getComments
};