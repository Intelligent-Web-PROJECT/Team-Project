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

async function listNewPlant(user, plant, photos){
    try {
        const { name, description, height, spread, flowers, leaves, fruits, sunExposure, flowerColour, longitude, latitude } = plant;
        const newPlant = new Plant({
            name: name,
            user: user,
            description: description,
            location: {
                latitude: latitude,
                longitude: longitude
            },
            height: height,
            spread: spread,
            photos: photos,
            characteristics: {
                have_flowers: flowers,
                have_leaves: leaves,
                have_fruits: fruits,
                sun_exposure: sunExposure,
                flower_colour: flowerColour
            }
        })

        return newPlant.save()

    } catch (error) {
        console.log(error)
    }
}

async function syncPlants(plants) {
    return await Plant.insertMany(plants)
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
    getComments,
    syncPlants
};