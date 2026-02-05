const CACHE_NAME = "Al-Tamsahya-cache-auto";

const CORE_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./icon-192.png"
];

// ==================
// INSTALL
// ==================
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
  );
});

// ==================
// ACTIVATE
// ==================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ==================
// FETCH (Network First)
// ==================
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/admin")) return;

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
