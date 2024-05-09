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

// Function to find all plants by a specific user ID
async function findAllPlantsByUserId(userId) {
    return Plant.find({ user: userId }).populate('user', 'username'); // Populate user details
}

// Function to find all plants in the database
async function findAllPlants() {
    return Plant.find().populate('user', 'username'); // Populate user details
}

async function addComment(plantId, userId, comment) {
    await Comment.findOne({plant: plantId})
        .then(comment => {
            if (!comment) {
                const newComment = new Comment({
                    plant: plantId,
                    comments: [{
                        user: userId,
                        comment: comment,
                        time: Date.now()
                    }]
                })
                return newComment.save()
            } else {
                comment.comments.push({
                    user: userId, comment: comment, time: Date.now()
                })
                return comment.save()
            }
        })
        .then(()=> console.log('message added successfully'))
        .catch(err => console.log('Error while adding message'))
}


module.exports = {
    getAllUsers,
    getUserById,
    searchUser,
    listNewPlant,
    findAllPlantsByUserId,
    findAllPlants,
    addComment
};