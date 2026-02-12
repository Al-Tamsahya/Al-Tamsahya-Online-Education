const CACHE_NAME = "edu-platform-v6";
const FILES_TO_CACHE = [
  "/Al-Tamsahya-Online-Education/",       // مجلد المشروع (index.html تلقائيًا)
  "/Al-Tamsahya-Online-Education/index.html",
  "/Al-Tamsahya-Online-Education/css/style.css",
  "/Al-Tamsahya-Online-Education/manifest.json",
  "/Al-Tamsahya-Online-Education/icon-192.png",
  "/Al-Tamsahya-Online-Education/icon-512.png"
];

// تثبيت الـ Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// تفعيل الـ Service Worker وحذف الكاش القديم
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

// التعامل مع الشبكة والـ cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // تجاهل طلب install.html
  if (url.pathname.includes("install.html")) return;

  // السماح بالطلبات الخارجية بدون cache
  if (url.hostname.includes("googleapis.com") || url.hostname.includes("gstatic.com")) return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // تخزين نسخة من الملفات الأساسية
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(async () => {
        // جلب من الكاش عند عدم وجود اتصال
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // صفحة offline افتراضية
        return new Response(
          `<html><body style="text-align:center;margin-top:100px;font-family:Arial">
            <h1 style="color:red">🚫 لا يوجد اتصال بالإنترنت</h1>
            <p>حاول مرة أخرى عند توفر الشبكة</p>
          </body></html>`,
          { headers: { "Content-Type": "text/html" }, status: 503 }
        );
      })
  );
});
