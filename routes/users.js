var express = require('express');
const {getLandingPage, getWelcomePage} = require("../controllers/landingPage");
const {getLoginPage, getRegisterPage} = require("../controllers/auth/authController");
const {listPlant} = require("../controllers/plantController");
var router = express.Router();

/* GET users listing. */

router.get('/list-plant', listPlant)

router.get('/welcome', getWelcomePage)

module.exports = router;
