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
    const plantContainer = document.querySelector('.list-group')

    for (const plant of plants) {
        const plantElement = document.createElement('a')
        plantElement.setAttribute('href', `/plants/{$plant._id}`)
        plantElement.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center'
        console.log(plant.id)
        let imageContent = ''
        if (plant.photos && plant.photos.length > 0) {
            const image = URL.createObjectURL(plant.photos[0])
            imageContent = `<img src="${image}" class="card-img-top" alt="<%= plant.name %>" style="max-height: 100px; max-width: 100px">`
        }
        const location = plant.latitude +', '+ plant.longitude
        plantElement.innerHTML = `
                <div>
                    ${imageContent}
                    <h5 class="mb-1">${plant.name}</h5>
                    <small>Location: ${location}</small><br>
                    <small>Added: ${new Date().toDateString()}</small>
                </div>
                <a class="btn btn-primary" href="/plants/${plant._id}"> View </a>
            `;
        plantContainer.appendChild(plantElement)
    }
}

function registerSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(function(registration) {
            return registration.sync.register('sync-data');
        }).then(function() {
            console.log('Sync event registered');
        }).catch(function(err) {
            console.log('Unable to register sync', err);
        });
    }
}
