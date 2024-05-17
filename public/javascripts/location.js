const axios = require('axios');


//------------------------------------------- Fetch Current Location ---------------------------------------------------//

const getLocation = async() => {
    try {
        const response = await axios.get('http://ipwhois.app/json/');
        return(response.data);
    } catch (error) {
        return(error)
    }
}


module.exports = {
    getLocation
}