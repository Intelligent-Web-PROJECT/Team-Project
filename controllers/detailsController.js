const { Plant } = require('../models/schema/plant');

// Function to render plant details page
function getPlantDetails(req, res, plantId, isAuthenticated) {
    Plant.findById(plantId)
        .then(plant => {
            if (!plant) {
                return res.status(404).send('Plant not found');
            }
            // Render the view with the plant details and authentication status
            res.render('plant/plant_details', { plant, auth: isAuthenticated });
        })
        .catch(err => {
            console.error('Error fetching plant details:', err);
            res.status(500).send('Error fetching plant details');
        });
}


module.exports = {
    getPlantDetails
};
