const {insertUser} = require("../models/mongodb");
const {getLocation} = require("../public/javascripts/location");


async function getLandingPage(req, res) {
    //Sample usage for location. Everytime you create an instance, it'll read the current fetched location.
    const location = await getLocation()
    res.render('index', {title: 'FloraScan', city: location.region, auth: req.isLoggedIn, user:req.user})
}

async function getWelcomePage(req, res) {
    res.render('welcome', {title: 'FloraScan', auth: req.isLoggedIn, user:req.user})
}

module.exports = {
    getLandingPage,
    getWelcomePage
}