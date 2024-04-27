var express = require('express');
var router = express.Router();

const {getLandingPage} = require('../controllers/landingPage')

/* GET home page. */
router.get('/', getLandingPage);

module.exports = router;
