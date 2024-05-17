var express = require('express');
const {listPlant, postPlant, getAllPlants, syncPlant, addMessage, syncComments} = require("../controllers/plantController");
const {upload} = require("../middlewares/multer");
const {getPlantDetails, updatePlantName} = require("../controllers/detailsController");
var router = express.Router();


router.get('/list-plant', listPlant)

router.post('/list-plant', upload.array('photos',3), postPlant)

router.post('/syncPlant', upload.array('photos', 3), syncPlant)

router.get('/allPlants', getAllPlants);

router.get('/plants/:plantId', getPlantDetails);

router.post('/updatePlant/:id',upload.none(), updatePlantName)

router.post('/addMessage',upload.none(), addMessage)

router.post('/syncComments',upload.none(), syncComments)

module.exports = router;
