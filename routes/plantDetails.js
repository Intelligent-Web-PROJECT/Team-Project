const express = require('express');
const router = express.Router();
const Plant = require('../models/schema/plant');

// Import the controller function for handling plant details
const { getPlantDetails } = require('../controllers/detailsController');

// Route handler to retrieve plant details
router.get('/:plantId', (req, res) => {
    const { plantId } = req.params; // Extract plantId from URL parameters
    const isAuthenticated = true; // Set the authentication status
    getPlantDetails(req, res, plantId, isAuthenticated);
});


module.exports = router;
