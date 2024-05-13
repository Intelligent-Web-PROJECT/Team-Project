const { Plant } = require('../models/schema/plant');
const { getComments } = require("../models/mongodb");
const https = require('https');

// Function to render plant details page
async function getPlantDetails(req, res) {
    try {
        const user = req.user;
        const plantId = req.params.plantId;

        // Get comments for the plant
        const plantComment = await getComments(plantId);

        // Find the plant by ID
        const plant = await Plant.findById(plantId);

        if (!plant) {
            return res.status(404).send('Plant not found');
        }

        // Fetch additional plant information from DBpedia
        const dbpediaInfo = await fetchPlantInfo(plant.name);

        // Render the view with the plant details, authentication status, and DBpedia information
        res.render('plant/plant_details', { plant, auth: req.isLoggedIn, user, plantComment, dbpediaInfo });
    } catch (error) {
        console.error('Error fetching and rendering plant details:', error);
        res.status(500).json({ error: 'Error fetching and rendering plant details' });
    }
}

// Function to fetch plant information from DBpedia
async function fetchPlantInfo(plantName) {
    return new Promise((resolve, reject) => {
        // Construct SPARQL query
        const sparqlQuery = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX dbp: <http://dbpedia.org/property/>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            
            SELECT ?description ?taxon ?primaryTopicUrl
            WHERE {
                ?plant rdfs:label "${plantName}"@en ;
                       dbo:abstract ?description ;
                       dbp:taxon ?taxon .
                OPTIONAL { 
                    ?plant foaf:isPrimaryTopicOf ?primaryTopic .
                    BIND(?primaryTopic AS ?primaryTopicUrl) .
                 }
                FILTER (langMatches(lang(?description), "en")) .
            }
            LIMIT 1`;

        // Encode the query as a URL parameter
        const encodedQuery = encodeURIComponent(sparqlQuery);

        // Build the URL for the SPARQL query
        const endpointUrl = 'https://dbpedia.org/sparql';
        const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

        console.log('SPARQL Query URL:', url);

        // Make the HTTPS GET request
        const request = https.get(url, (response) => {
            let data = '';

            // Concatenate response data
            response.on('data', (chunk) => {
                data += chunk;
            });

            // Extract plant description, taxon, and primaryTopicUrl, and resolve the promise
            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    if (jsonData.results.bindings.length === 0) {
                        resolve(null);
                    } else {
                        const description = jsonData.results.bindings[0].description.value;
                        const taxon = jsonData.results.bindings[0].taxon ? jsonData.results.bindings[0].taxon.value : null;
                        const primaryTopicUrl = jsonData.results.bindings[0].primaryTopicUrl ? jsonData.results.bindings[0].primaryTopicUrl.value : null;
                        resolve({ description, taxon, primaryTopicUrl });
                    }
                } catch (error) {
                    console.error('Error parsing JSON data:', error);
                    reject(error);
                }
            });
        });

        request.on('error', (error) => {
            console.error('Error fetching plant information from DBpedia:', error);
            reject(error);
        });
    });
}



module.exports = {
    getPlantDetails
};