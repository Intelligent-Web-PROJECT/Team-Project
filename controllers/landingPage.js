
async function getLandingPage(req, res) {
    res.render('index', {title: 'FloraScan'})
}

module.exports = {
    getLandingPage
}