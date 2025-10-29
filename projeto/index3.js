const CACHE_NAME = 'pokemon-app-v1';
const urlsToCache = [
  '/',
  'projeto3_css_vitor-Moraes.html',
  '048dc3426e3c4560aaf659643560856f.png',
  'pokebola.png',
  '260.png',
  '392.png',
  '724.png',
  'Pixeled.ttf'
];

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
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});