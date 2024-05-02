const multer = require('multer')

var upload = multer({storage: multer.memoryStorage()})

module.exports = {
    upload
}