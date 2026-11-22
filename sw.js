/* Service worker : l'appli fonctionne entièrement hors ligne après la 1re ouverture. */
const CACHE = 'aeroops-202611212355';
const FILES = [
  "./",
  "css/app.css",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/logo_air_algerie.png",
  "index.html",
  "js/app.js",
  "js/chunk-7I563G2N.js",
  "js/importer-3MPP5NLS.js",
  "lib/pdf.worker.js",
  "manifest.webmanifest",
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('aeroops-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(resp => {
    if (resp.ok && new URL(e.request.url).origin === location.origin) { const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return resp;
  }).catch(() => caches.match('./'))));
});
