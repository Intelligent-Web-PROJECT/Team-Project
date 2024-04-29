function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    // Distance in kilometers
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function sortItemsByDistance(myLatitude, myLongitude, items) {
    // Calculate distance for each item and add it as a new property
    const itemsWithDistance = items.map(item => {
        const distance = calculateDistance(myLatitude, myLongitude, item.latitude, item.longitude);
        return { ...item, distance };
    });

    // Sort items based on distance
    return itemsWithDistance.sort((a, b) => a.distance - b.distance);
}

module.exports = {
    sortItemsByDistance
};