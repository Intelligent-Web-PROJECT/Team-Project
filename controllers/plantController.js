

function listPlant(req, res) {
    res.render('plant/list_plant',{user: req.user, auth: req.isLoggedIn})
}

module.exports = {
    listPlant
}