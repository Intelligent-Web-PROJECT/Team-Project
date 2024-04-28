var express = require('express');
var router = express.Router();

const {getLandingPage, getWelcomePage} = require('../controllers/landingPage')

/* GET home page. */
router.get('/', getLandingPage);
router.get('/welcome', getWelcomePage)

module.exports = router;
