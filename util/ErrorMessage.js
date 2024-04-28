function showErrorMessage(req, message) {
    req.flash('error', message);
}

module.exports = {
    showErrorMessage
};