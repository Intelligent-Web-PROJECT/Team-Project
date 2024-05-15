var express = require('express');
const {getLandingPage, getWelcomePage} = require("../controllers/landingPage");
const {getLoginPage, getRegisterPage} = require("../controllers/auth/authController");
const {listPlant, postPlant, getAllPlants, getMyPlant, getChats, syncPlant} = require("../controllers/plantController");
const {upload} = require("../middlewares/multer");
const {getPlantDetails} = require("../controllers/detailsController");
var router = express.Router();

/* GET users listing. */

router.get('/list-plant', listPlant)

router.post('/list-plant', upload.array('photos',3), postPlant)

router.post('/syncPlant', upload.array('photos', 3), syncPlant)

router.get('/welcome', getWelcomePage)

// Get all plants
router.get('/allPlants', getAllPlants);


// Get My Plants page
router.get('/my-plants', getMyPlant);

router.get('/plants/:plantId', getPlantDetails);


module.exports = router;
