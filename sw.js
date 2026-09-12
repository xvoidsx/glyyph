/* glyyph service worker — app-shell cache for installable use.
 * Bump CACHE when shipping a new build so clients pick it up. */
const CACHE = 'glyyph-v1';
const SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      // Cache each shell asset independently so one failure can't fail install.
      await Promise.all(SHELL.map(async (url) => {
        try {
          const res = await fetch(url, { cache: 'reload' });
          if (res && res.ok) await cache.put(url, res);
        } catch {}
      }));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Only handle same-origin app traffic; relay sockets and CDN pass through.
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(request, { ignoreSearch: false }).then((hit) => {
      const fresh = fetch(request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return res;
      }).catch(() => hit);
      // Navigations: network first so a new ship is picked up, shell on failure.
      if (request.mode === 'navigate') {
        const shell = new URL('index.html', self.registration.scope).href;
        return fresh.catch(() => caches.match(shell));
      }
      return hit || fresh;
    })
  );
});
