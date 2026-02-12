const CACHE_NAME = "edu-platform-v7";

const BASE_PATH = "/Al-Tamsahya-Online-Education/";

const FILES_TO_CACHE = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.json",
  BASE_PATH + "css/style.css",
  BASE_PATH + "icon-192.png",
  BASE_PATH + "icon-512.png"
];

// تثبيت
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// تفعيل وحذف القديم
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

// التعامل مع الطلبات
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // تجاهل Firebase و Google
  if (
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("gstatic.com")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;

          // fallback إلى الصفحة الرئيسية
          return caches.match(BASE_PATH + "index.html");
        });
      })
  );
});
