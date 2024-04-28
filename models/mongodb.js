const {User, Plant} = require('./models')

const mongoose = require('mongoose')

// async function insertUser() {
//     try {
//         const newUser = new User({
//             username: 'Ayush',
//             email: 'Ayush@gmail.com',
//             password: 'password'
//         })
//         const savedDevice = await newUser.save()
//         return savedDevice._id
//     } catch (error) {
//         console.log(error)
//     }
// }

async function getAllUsers() {
    return User.find();
}

async function getUserById(id) {
    return await User.findOne({_id: id});
}

async function searchUser(filter) {
    return User.findOne(filter);
}

module.exports = {
    // insertUser,
    getAllUsers,
    getUserById,
    searchUser
}