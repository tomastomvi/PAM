const CACHE_NAME = 'pokemon-app-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/login.css',
  '/048dc3426e3c4560aaf659643560856f.png',
  '/pokebola.png',
  '/260.png',
  '/392.png',
  '/724.png',
  '/Pixeled.ttf',
  '/js/index.js',
  '/js/login.js',
  '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o cache se encontrado, senão faz a requisição
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});