var express = require('express');
const {getLandingPage} = require("../controllers/landingPage");
const {getLoginPage, getRegisterPage} = require("../controllers/auth/authController");
const {listPlant} = require("../controllers/plantController");
var router = express.Router();

/* GET users listing. */

router.get('/list-plant', listPlant)

module.exports = router;
