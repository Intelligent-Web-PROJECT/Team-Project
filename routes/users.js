var express = require('express');
const {getLandingPage} = require("../controllers/landingPage");
const {getLoginPage, getRegisterPage} = require("../controllers/auth/authController");
var router = express.Router();

/* GET users listing. */
router.get('/login', getLoginPage)
router.get('/register', getRegisterPage)

module.exports = router;
