const {Plant, Comment} = require('./models')

const mongoose = require('mongoose')


// mongo function to list a new plant
async function listNewPlant(plant, photos){
    try {
        const { name, nickname, description, date, height, spread, flowers, leaves, fruits, sunExposure, flowerColour, longitude, latitude } = plant;
        const newPlant = new Plant({
            name: name,
            nickname: nickname,
            description: description,
            date: date,
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


// Function to find all plants in the database
async function findAllPlants() {
    return Plant.find()
}


// Function to add comment to the mongodb
async function addComment(plantId, userId, commentText) {
    try {
        const existingComment = await Comment.findOne({plant: plantId})
        if (!existingComment) {
            const newComment = new Comment({
                plant: plantId,
                comments: [{
                    nickname: userId,
                    text: commentText,
                    time: Date.now()
                }]
            })
            return await newComment.save()
        } else {
            existingComment.comments.push({
                nickname: userId,
                text: commentText,
                time: Date.now()
            })
            return await existingComment.save()
        }
    }catch (error) {
        console.log(error)
    }
}


// Function to get comments from the mongodb
async function getComments(plantId) {
    return await Comment.findOne({plant: plantId})
}


//function to update the plant name
async function updatePlant(plantId, name) {
    const filter = {
        _id: plantId
    }
    const update = {
        $set: {
            name: name
        }
    }
    return await Plant.updateOne(filter, update);
}


module.exports = {
    listNewPlant,
    findAllPlants,
    addComment,
    getComments,
    updatePlant
};