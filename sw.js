// Sharod Sathi Service Worker - PWA Offline Caching
const CACHE_NAME = 'sharod-sathi-v5';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/festive.css',
  './css/map.css',
  './js/app.js',
  './js/pwa.js',
  './js/checklist.js',
  './js/itinerary.js',
  './js/navigation.js',
  './js/map.js',
  './js/data/pandals.js',
  './js/data/hubs.js',
  './js/data/food.js',
  './js/data/amenities.js',
  './js/data/transitRoutes.js',
  './js/data/pandalManager.js',
  './js/routing/distance.js',
  './js/routing/optimizer.js',
  './data/pandals.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/favicon.png',
  './assets/mobile_qr.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Bypass cache for external OSRM routing
  if (request.url.includes('project-osrm.org')) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ code: 'Offline' })))
    );
    return;
  }

  // True Network-First: Fetch fresh code from server, update cache, fallback to offline cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
