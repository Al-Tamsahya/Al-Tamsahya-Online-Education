const CACHE_NAME = "edu-platform-v8";

const BASE_PATH = "/Al-Tamsahya-Online-Education/";

const FILES_TO_CACHE = [
<<<<<<< HEAD
    BASE_PATH,
    BASE_PATH + "index.html",
    BASE_PATH + "manifest.json",
    BASE_PATH + "css/style.css",
    BASE_PATH + "icon-192.png",
    BASE_PATH + "icon-512.png"
=======
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.json",
  BASE_PATH + "css/style.css",
  BASE_PATH + "icon-192.png",
  BASE_PATH + "icon-512.png"
>>>>>>> 86b0063a6a7a65235492840f579e1aac1f4798d4
];


// =========================
// تثبيت الـ Service Worker
// =========================
self.addEventListener("install", (event) => {
<<<<<<< HEAD
    self.skipWaiting(); // تفعيل مباشر بدون انتظار
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
=======
  self.skipWaiting(); // تفعيل مباشر بدون انتظار
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
  );
>>>>>>> 86b0063a6a7a65235492840f579e1aac1f4798d4
});


// =========================
// تفعيل وحذف الكاش القديم
// =========================
self.addEventListener("activate", (event) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 86b0063a6a7a65235492840f579e1aac1f4798d4
});


// =========================
// استقبال أمر التحديث اليدوي
// =========================
self.addEventListener("message", (event) => {
<<<<<<< HEAD
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
=======
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
>>>>>>> 86b0063a6a7a65235492840f579e1aac1f4798d4
});


// =========================
// التعامل مع الطلبات
// =========================
self.addEventListener("fetch", (event) => {
<<<<<<< HEAD
=======

  if (event.request.method !== "GET") return;
>>>>>>> 86b0063a6a7a65235492840f579e1aac1f4798d4

    if (event.request.method !== "GET") return;

<<<<<<< HEAD
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

                // حفظ نسخة في الكاش
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, copy);
                });

                return response;
            })
            .catch(() => {

                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;

                    // fallback للصفحة الرئيسية عند عدم الاتصال
                    return caches.match(BASE_PATH + "index.html");
                });

            })
    );

});
=======
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

        // حفظ نسخة في الكاش
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });

        return response;
      })
      .catch(() => {

        return caches.match(event.request).then((cached) => {
          if (cached) return cached;

          // fallback للصفحة الرئيسية عند عدم الاتصال
          return caches.match(BASE_PATH + "index.html");
        });

      })
  );

});
>>>>>>> 86b0063a6a7a65235492840f579e1aac1f4798d4
