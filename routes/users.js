var express = require('express');
const {getLandingPage, getWelcomePage} = require("../controllers/landingPage");
const {getLoginPage, getRegisterPage} = require("../controllers/auth/authController");
const {listPlant, postPlant, getAllPlants, getMyPlant, getChats} = require("../controllers/plantController");
const {upload} = require("../middlewares/multer");
var router = express.Router();

/* GET users listing. */

router.get('/list-plant', listPlant)

router.post('/list-plant', upload.array('photos',3), postPlant)

router.get('/welcome', getWelcomePage)

// Get all plants
router.get('/allPlants', getAllPlants);


// Get My Plants page
router.get('/my-plants', getMyPlant);


module.exports = router;
