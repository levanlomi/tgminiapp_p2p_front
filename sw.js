const CACHE_NAME = 'tma-vnd-v3'; // Увеличили версию

self.addEventListener('install', event => {
  self.skipWaiting(); // Принудительно ставим новую версию
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );
});

self.addEventListener('fetch', event => {
  // Запросы к API не должны кешироваться вообще
  if (event.request.url.includes('onrender.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});