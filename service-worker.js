const CACHE_NAME = "edu-platform-v3";

// الملفات الثابتة التي سيتم كاشها
const FILES_TO_CACHE = [
    "./",
    "./css/style.css",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
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
            Promise.all(
                keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
            )
        )
    );
    self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    // السماح لطلبات Firebase بالمرور
    if (
        url.hostname.includes("googleapis.com") ||
        url.hostname.includes("gstatic.com") ||
        url.pathname.startsWith("/api") ||
        url.pathname.includes("login") ||
        url.pathname.includes("register")
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((res) => {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                return res;
            })
            .catch(async () => {
                const cached = await caches.match(event.request);
                if (cached) return cached;

                return new Response(
                    `<html>
                        <head>
                            <title>🚫 لا يوجد اتصال بالإنترنت</title>
                            <style>
                                body { text-align:center; margin-top:100px; font-family:Arial,sans-serif; }
                                h1 { color:red; }
                            </style>
                        </head>
                        <body>
                            <h1>🚫 لا يوجد اتصال بالإنترنت</h1>
                            <p>حاول مرة أخرى عند توفر الشبكة</p>
                        </body>
                    </html>`,
                    { headers: { "Content-Type": "text/html" }, status: 503 }
                );
            })
    );
});
