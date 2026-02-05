const CACHE_NAME = "Al-Tamsahya-cache-v4";

const urlsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./manifest.json",
  "./icon-192.png"
];

// ==================
// INSTALL
// ==================
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// ==================
// ACTIVATE
// ==================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ==================
// FETCH
// ==================
self.addEventListener("fetch", (event) => {
  // ❌ لا تطبق على admin
  if (event.request.url.includes("/admin")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
