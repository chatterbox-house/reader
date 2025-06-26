// sw.js - Basic Service Worker
const CACHE_NAME = 'jap-learner-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];
event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(urlsToCache).catch(error => {
        console.error('Failed to cache:', error);
      });
    })
);
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
