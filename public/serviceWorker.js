const filesToCache = [
    "https://tile.openstreetmap.org/13/51.505/-0.09.png",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    "javascripts/message.js",
    "javascripts/plantListing.js",
    "manifest.json",
    "images/collection.png",
    "images/leaf-logo.svg",
    "images/placeholder.jpg",
    "images/plant-community.jpg",
    "images/plant-snap.png",
    "/allPlants",
    "/list-plant",
    "/my-plants",
    "/plants",
    "/"
];
const staticCacheName = 'Plants Recognition';

self.addEventListener('install', event => {
    console.log('Installing plants service worker');
    event.waitUntil(caches.open(staticCacheName).then(cache => {
        console.log('Caching the file');
        return cache.addAll(filesToCache);
    }));
});

self.addEventListener('fetch', (event) => {
    const parsedUrl = new URL(event.request.url);
    if (parsedUrl.pathname === '/plants') {
        event.respondWith(
            caches.match(parsedUrl.pathname).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    const params = new URLSearchParams(parsedUrl.search);
                    const id = params.get('id');
                    const cacheKey = `/plants/${id}`;
                    return caches.match(cacheKey).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        } else {
                            return networkThenCache(event, cacheKey);
                        }
                    });
                }
            })
        );
    } else {
        event.respondWith(networkThenCache(event));
    }
});

async function networkThenCache(event) {
    try {
        const networkResponse = await fetch(event.request);
        console.log('Calling network: ' + event.request.url);

        const cache = await caches.open(staticCacheName);
        if (event.request.method === 'GET') {
            await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.info('Failed to fetch from network:', error);

        const cache = await caches.open(staticCacheName);
        if (event.request.method === 'GET') {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                console.log('Serving From Cache: ' + event.request.url);
                return cachedResponse;
            }
        }
        return new Response('You are currently offline! Please check your Internet connection');
    }
}


