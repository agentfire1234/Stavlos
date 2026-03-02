const CACHE_NAME = 'stavlos-v1'
const OFFLINE_URL = '/offline'
const CACHE_ASSETS = ['/offline', '/icons/icon-192x192.png', '/icons/icon-512x512.png']

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_ASSETS)))
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(names =>
            Promise.all(names.map(name => name !== CACHE_NAME && caches.delete(name)))
        )
    )
    self.clients.claim()
})

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() =>
                caches.open(CACHE_NAME).then(cache => cache.match(OFFLINE_URL))
            )
        )
    }
})
