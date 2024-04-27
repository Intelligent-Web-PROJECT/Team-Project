const {insertUser} = require("../models/mongodb");


async function getLandingPage(req, res) {
    const user = await insertUser()
    console.log(user)
    res.render('index', {title: 'FloraScan'})
}

module.exports = {
    getLandingPage
}