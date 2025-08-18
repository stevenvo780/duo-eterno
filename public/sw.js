/**
 * Service Worker para Duo Eterno.
 *
 * Estrategia de caché
 * -------------------
 * - Precache de rutas críticas (App Shell) en la fase `install`.
 * - `activate` realiza limpieza de versiones antiguas para evitar acumulación.
 * - `fetch` aplica Cache-First con actualización en segundo plano:
 *   • Si existe en caché ⇒ responde inmediatamente (latencia mínima).
 *   • Si no ⇒ va a red, responde y guarda copia en caché para el futuro.
 *   • Fallback: ante fallo de red, devuelve `/index.html` para SPA routing.
 *
 * Notas de consistencia
 * ---------------------
 * - Cambiar `CACHE_NAME` invalida todo el caché previa activación.
 * - Sólo maneja peticiones GET del mismo origen para no interferir con API externas.
 */
const CACHE_NAME = 'duo-eterno-v1';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.webmanifest', '/vite.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(response => {
          const copy = response.clone();
          caches
            .open(CACHE_NAME)
            .then(cache => cache.put(request, copy))
            .catch(() => {});
          return response;
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});
