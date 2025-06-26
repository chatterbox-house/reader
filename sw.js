// sw.js - Updated Service Worker
const CACHE_NAME = 'jap-learner-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Don't include files that don't exist (like styles.css, app.js if you don't have them)
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activation of the new SW
});

        // Only cache essential files that definitely exist
        return cache.addAll(urlsToCache.filter(url => {
          // Skip files that might not exist
          if (url === '/styles.css' || url === '/app.js') {
            return false;
          }
          return true;
        }));
      })
      .catch(err => {
        console.error('Cache addAll error:', err);
        // Skip failing files but continue with installation
        return Promise.resolve();
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found, otherwise fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback for failed requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html'); // Fall back to index.html
        }
        return new Response('Offline - No connection', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

self.addEventListener('activate', event => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
