var express = require('express');
const {getLandingPage, getWelcomePage} = require("../controllers/landingPage");
const {getLoginPage, getRegisterPage} = require("../controllers/auth/authController");
var router = express.Router();

/* GET users listing. */
router.get('/welcome', getWelcomePage)
module.exports = router;
