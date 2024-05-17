const axios = require('axios');

// api used to get the users current location
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