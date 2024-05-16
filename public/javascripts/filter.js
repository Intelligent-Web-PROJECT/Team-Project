document.addEventListener('DOMContentLoaded', function() {
    const filterSelect = document.getElementById('filter');
    const plantList = document.getElementById('plant-list');
    const plantItems = Array.from(document.querySelectorAll('.list-plants'))

    filterSelect.addEventListener('change', function() {
        console.log('inside filtesr')
        const filterValue = filterSelect.value;
        let filteredPlants;
        plantItems.forEach(item => {
            console.log(item.dataset.flowers.length)
        });

        switch (filterValue) {
            case '1':
                // Distance (farthest)
                filteredPlants = plantItems.sort((a, b) => parseFloat(b.dataset.distance) - parseFloat(a.dataset.distance));
                break;
            case '2':
                // Distance (nearest)
                filteredPlants = plantItems.sort((a, b) => parseFloat(a.dataset.distance) - parseFloat(b.dataset.distance));
                break;
            case '3':
                // Has Flowers
                filteredPlants = plantItems.filter(item => item.dataset.flowers === 'true');
                break;
            case '4':
                // No Flowers
                filteredPlants = plantItems.filter(item => item.dataset.flowers === 'false');
                break;
            case '0':
            default:
                filteredPlants = plantItems;
                break;
        }

        plantList.innerHTML = '';
        filteredPlants.forEach(plant => plantList.appendChild(plant));
    });
});