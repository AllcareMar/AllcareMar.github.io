// Service Worker for Allcare Sales Compass PWA.
// Registered from /compass/sw.js, so its scope is /compass/ only - it never
// touches the rest of www.allcaremar.com. API calls (other origin) are never
// cached: plan and client data must always come fresh from the server.
const CACHE_NAME = 'allcare-compass-v2';
const ASSETS_TO_CACHE = ['./', './manifest.json', './icons/emblem-192.png', './icons/emblem-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(ASSETS_TO_CACHE).catch((err) => console.warn('PWA cache addAll error:', err))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/')) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('./');
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
    )
  );
});
