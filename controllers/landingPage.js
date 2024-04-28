const {insertUser} = require("../models/mongodb");


async function getLandingPage(req, res) {
    res.render('index', {title: 'FloraScan'})
}

async function getWelcomePage(req, res) {
    res.render('welcome', {title: 'FloraScan', auth: req.isLoggedIn, user:req.user})
}

module.exports = {
    getLandingPage,
    getWelcomePage
}