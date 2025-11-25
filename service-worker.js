const CACHE_NAME = 'mm-cache-v1';
const ASSETS = [
  '/index.html', '/style.css', '/script.js', '/manifest.json',
  '/assets/icon-192.png', '/assets/icon-512.png',
  '/assets/aurora-fallback.jpg',
  '/assets/stock/table.jpg', '/assets/stock/chair.jpg', '/assets/stock/window.jpg', '/assets/stock/door.jpg', '/assets/stock/placard.jpg',
  '/assets/gallery/door-before.jpg', '/assets/gallery/door-after.jpg',
  '/assets/gallery/table-before.jpg', '/assets/gallery/table-after.jpg',
  '/assets/avatars/a1.png', '/assets/avatars/a2.png', '/assets/avatars/a3.png',
  '/assets/community/c1.jpg', '/assets/community/c2.jpg', '/assets/community/c3.jpg', '/assets/community/c4.jpg',
  '/assets/ar/table.png', '/assets/ar/door.png', '/assets/ar/chair.png',
  '/assets/qr-whatsapp.png', '/assets/qr-site.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.error("Failed to cache assets", err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.mode === 'navigate') {
    // Network-first for HTML
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for assets
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
      return cached || fetchPromise;
    })
  );
});
