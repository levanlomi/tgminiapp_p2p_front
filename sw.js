const CACHE_NAME = 'tma-vnd-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  // Мы НЕ кешируем запросы к нашему API на Render, чтобы данные всегда были свежими
  if (event.request.url.includes('onrender.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});