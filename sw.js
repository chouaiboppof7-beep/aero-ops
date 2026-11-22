/* Service worker : l'appli fonctionne entièrement hors ligne après la 1re ouverture. */
const CACHE = 'aeroops-202611221201';
const FILES = [
  "./",
  "app.css",
  "app.js",
  "apple-touch-icon.png",
  "chunk-2HE2Z4LN.js",
  "favicon-32.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "importer-26HHGXKO.js",
  "index.html",
  "logo_air_algerie.png",
  "manifest.webmanifest",
  "pdf.worker.js",
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
