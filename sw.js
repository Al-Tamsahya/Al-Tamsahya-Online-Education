const CACHE_NAME = "Al-Tamsahya-cache-v2";

const CORE_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/style.css",
    "./icon-192.png"
];

/* ==================
   INSTALL
================== */
self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_FILES);
        })
    );
});

/* ==================
   ACTIVATE
================== */
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

/* ==================
   FETCH (SAFE + SMART)
================== */
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // ❌ تجاهل أي طلب غير GET (حل المشكلة الأساسية)
    if (request.method !== "GET") {
        return;
    }

    // ❌ تجاهل Firebase / Admin / Auth
    if (
        request.url.includes("firebase") ||
        request.url.includes("googleapis") ||
        request.url.includes("/admin")
    ) {
        return;
    }

    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            // لو موجود في الكاش → رجّعه
            if (cachedResponse) {
                return cachedResponse;
            }

            // غير موجود → اجلبه من الشبكة وخزّنه
            return fetch(request)
                .then((networkResponse) => {
                    if (
                        !networkResponse ||
                        networkResponse.status !== 200 ||
                        networkResponse.type !== "basic"
                    ) {
                        return networkResponse;
                    }

                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });

                    return networkResponse;
                })
                .catch(() => {
                    // fallback لو مفيش شبكة
                    return caches.match("./index.html");
                });
        })
    );
});
