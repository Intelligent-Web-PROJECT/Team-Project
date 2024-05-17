const {insertUser} = require("../models/mongodb");
const {getLocation} = require("../public/javascripts/location");


async function getLandingPage(req, res) {
    //Sample usage for location. Everytime you create an instance, it'll read the current fetched location.
    // const location = await getLocation()
    res.render('index', {title: 'FloraScan', user:req.user})
}

async function getWelcomePage(req, res) {
    res.render('welcome', {title: 'FloraScan', user:req.user})
}

module.exports = {
    getLandingPage,
    getWelcomePage
}