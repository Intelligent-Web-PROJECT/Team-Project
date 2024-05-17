const staticCacheName = 'Plants Recognition';

self.addEventListener('install', event => {
    console.log('Installing plants service worker');
    event.waitUntil(caches.open(staticCacheName).then(cache => {
        console.log('Caching the file');
        return cache.addAll(['/', '/allPlants',
            '/stylesheets/landing.css',
            '/stylesheets/style.css',
            '/stylesheets/list_plant_style.css',
            '/stylesheets/bootstrap.min.css',
            "images/collection.png",
            "images/leaf-logo.svg",
            "images/placeholder.jpg",
            "images/plant-community.jpg",
            "images/plant-snap.png"]);
    }));
});

self.addEventListener('fetch', (event) => {
    console.log("in fetch of service worker")
    const url = new URL(event.request.url)

    if (url.pathname.startsWith('/login')) {
        event.respondWith(fetch(event.request))
        return
    }
    event.respondWith(networkThenCache(event));

});

async function networkThenCache(event) {
    try {
        const networkResponse = await fetch(event.request);
        console.log('Calling network: ' + event.request.url);

        const cache = await caches.open(staticCacheName);
        await cache.put(event.request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.info('Failed to fetch from network:', error);

        const cache = await caches.open(staticCacheName);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Serving From Cache: ' + event.request.url);
            return cachedResponse;
        }
        return new Response('You are currently offline! Please check your Internet connection');
    }
}

self.addEventListener('sync',  async (event) => {
    console.info('Event: Sync', event);
    try {
        const plants = await getSightingFromIndexDB();
        const result = await syncPlantData(plants);
        console.log('Synced plants', plants)
        await updatePlant(plants);

        // const comments = await getCommentFromIndexDB();
        // const commentResult = await syncCommentToMongoDB(comments);
        // updateCommentUnsync(commentResult);

        console.info('All Sync Done!');

    } catch (error) {
        console.error('Sync Failed:', error);
    }
});

async function getSightingFromIndexDB() {
    return new Promise(function(resolve, reject) {
        const request = indexedDB.open("plantRecogn",2);
        request.onerror = function(event) {
            reject(event.target.error);
        };
        request.onsuccess = function(event) {
            const plantDB = event.target.result
            const transaction = plantDB.transaction(["plantsSighting"],"readwrite")
            const plantStore = transaction.objectStore("plantsSighting")

            const cursorRequest = plantStore.openCursor();
            const result = [];

            cursorRequest.onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;
                    if (data._id == -1){
                        result.push(data);
                    }
                    cursor.continue();
                } else {
                    resolve(result);
                }
            };

            cursorRequest.onerror = function(event) {
                reject(event.target.error);
            };
        }
    })
}

async function updatePlant(syncedPlants) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("plantRecogn", 2);

        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => {
            const plantDB = event.target.result;
            const transaction = plantDB.transaction(["plantsSighting"], "readwrite");
            const plantStore = transaction.objectStore("plantsSighting");

            const cursorRequest = plantStore.openCursor();
            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const plant = cursor.value;
                    const syncedPlant = syncedPlants.find(p => p._id === plant._id);
                    if (syncedPlant) {
                        const deleteRequest = cursor.delete();
                        deleteRequest.onsuccess = () => {
                            console.log(`Deleted plant ${plant._id} from IndexedDB`);
                        };
                        deleteRequest.onerror = (event) => {
                            console.error(`Failed to delete plant ${plant._id}`, event.target.error);
                        };
                    }
                    cursor.continue();
                } else {
                    console.log('No more entries to iterate.');
                    resolve();
                }
            };
            cursorRequest.onerror = (event) => {
                console.error('Failed to open cursor:', event.target.error);
                reject(event.target.error);
            };
        };
    });
}

async function syncPlantData(data) {
    console.log("Syncing Plant Data to MongoDB:",data)
    let formData = new FormData();
    formData.append("data",JSON.stringify(data))
    data.forEach(function (obj) {
        Object.keys(obj).forEach(function (key) {
            if (key === 'photos') {
                console.log(obj[key])
                formData.append(key, obj[key]);
            }
        });
    });

    try {
        const response = await fetch('/syncPlant', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }

        return await response.json();
    } catch (error) {
        console.log('Error submitting form:', error);
        throw error;
    }
}



