const CACHE_NAME = "edu-platform-v3";

// نكاش الملفات الثابتة فقط
const FILES_TO_CACHE = [
  "./",
  "./css/style.css",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  // تجاهل أي طلب غير GET
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // تجاهل Firestore/Firebase/API
  if (
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("gstatic.com") ||
    url.pathname.includes("register") ||
    url.pathname.includes("login") ||
    url.pathname.includes("api")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // نخزن نسخة من الرد في الكاش (للملفات الثابتة)
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(async () => {
        // إذا النت فصل: حاول من الكاش
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // fallback رسالة
        return new Response(
          `
          <html>
            <body style="text-align:center;margin-top:100px;font-family:Arial">
              <h1 style="color:red">🚫 لا يوجد اتصال بالإنترنت</h1>
              <p>حاول مرة أخرى عند توفر الشبكة</p>
            </body>
          </html>
          `,
          { headers: { "Content-Type": "text/html" }, status: 503 }
        );
      })
  );
});
