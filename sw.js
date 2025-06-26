const CACHE_NAME = 'jap-learner-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // No need to include styles.css as your styles are in index.html
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found, otherwise fetch from network
        return response || fetch(event.request);
      })
  );
});
