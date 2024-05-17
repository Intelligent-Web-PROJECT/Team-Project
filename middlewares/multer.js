const multer = require('multer')

var upload = multer({storage: multer.memoryStorage()})

module.exports = {
    upload
}

// Middleware used to upload the image files from the formData