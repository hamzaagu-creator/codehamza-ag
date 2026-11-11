const CACHE_NAME = "codehamza-offline-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./im.hamza.png",
  "./1.png",
  "./2.png",
  "./3.png",
  "./lessons.png",
  "./car1.html",
  "./Serie1.html",
  "./Serie2.html",
  "./Serie3.html",
  "./Serie4.html",
  "./Serie5.html",
  "./Serie6.html",
  "./Serie7.html",
  "./Serie8.html",
  "./Serie9.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.allSettled(
        FILES_TO_CACHE.map(file => cache.add(file))
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("codehamza-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(async cached => {
      if (cached) return cached;

      try {
        const response = await fetch(event.request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        if (event.request.mode === "navigate") {
          return (
            await caches.match(event.request) ||
            await caches.match("./index.html")
          );
        }

        return new Response("غير متاح بدون إنترنت", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })
  );
});
