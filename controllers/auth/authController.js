function getLoginPage(req, res) {
    res.render('auth/login')
}
function getRegisterPage(req, res) {
    res.render('auth/register')
}

module.exports = {
    getLoginPage,
    getRegisterPage
}