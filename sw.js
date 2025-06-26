// sw.js - Service Worker for JapLearner
const CACHE_NAME = 'jap-learner-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
].map(url => new Request(url, {credentials: 'same-origin'}));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return Promise.all(
          urlsToCache.map(request => {
            return fetch(request.clone()).then(response => {
              if (response.ok) {
                return cache.put(request, response);
              }
              console.warn('Failed to cache:', request.url);
            }).catch(err => {
              console.warn('Error caching:', request.url, err);
            });
          })
        );
      })
      .catch(err => {
        console.error('Cache opening failed:', err);
      })
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the new response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(err => {
            console.error('Fetch failed; returning offline page:', err);
            // Return a fallback response if both cache and network fail
            return caches.match('/offline.html');
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // Take control of all clients
      return self.clients.claim();
    })
  );
});
