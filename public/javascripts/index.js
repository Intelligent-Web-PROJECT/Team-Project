window.onload = async function () {
    registerSync()
    if (!navigator.onLine) {
        let plants = await getData()
        console.log(plants)
        addToView(plants)
    }
}

async function getData() {
    return await getPlantSighting()
}

function addToView(plants) {
    const plantContainer = document.getElementById('plant-list');

    plants.forEach(plant => {
        const plantElement = document.createElement('div');
        plantElement.classList.add('col-md-4', 'mb-4', 'list-plants');
        plantElement.dataset.distance = plant.distance;
        plantElement.dataset.flowers = plant.flowers;

        let imageContent = '';
        if (plant.photos) {
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                const image = e.target.result;
                imageContent = `<img src="${image}" class="card-img-top" alt="${plant.name}">`;
                plantElement.innerHTML = `
                        <div class="card h-100 shadow">
                            ${imageContent}
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${plant.name}</h5>
                                <p class="flex-grow-1 fw-medium fs-6">The plant has flowers: <span class="fw-normal">${plant.flowers === 'true' ? "Yes" : "No"}</span></p>
                                <p class="flex-grow-1 fw-medium fs-6">Distance from you: <span class="fw-normal">${parseFloat(plant.distance).toFixed(2)} km</span></p>
                                <p class="flex-grow-1 fw-medium fs-6">Sighted by: <span class="fw-normal">${plant.nickname}</span></p>
                                <a href="/plants/${plant._id}" class="btn btn-primary mt-auto">View</a>
                            </div>
                        </div>
                    `;
                plantContainer.appendChild(plantElement);
            };
            fileReader.readAsDataURL(plant.photos);
        } else {
            plantElement.innerHTML = `
                    <div class="card h-100 shadow">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${plant.name}</h5>
                            <p class="flex-grow-1 fw-medium fs-6">The plant has flowers: <span class="fw-normal">${plant.flowers === 'true' ? "Yes" : "No"}</span></p>
                            <p class="flex-grow-1 fw-medium fs-6">Distance from you: <span class="fw-normal">${parseFloat(plant.distance).toFixed(2)} km</span></p>
                            <p class="flex-grow-1 fw-medium fs-6">Sighted by: <span class="fw-normal">${plant.nickname}</span></p>
                            <a href="/plants/${plant._id}" class="btn btn-primary mt-auto">View</a>
                        </div>
                    </div>
                `;
            plantContainer.appendChild(plantElement);
        }
    });
}

function registerSync() {
    new Promise(function (resolve, reject) {
        Notification.requestPermission(function (result) {
            resolve();
        })
    }).then(function () {
        return navigator.serviceWorker.ready;
    }).then(async function (reg) {
        return reg.sync.register('sync-tag');
    }).then(function () {
        console.info('Sync registered');
    }).catch(function (err) {
        console.error('Failed to register sync:', err.message);
    });
}
