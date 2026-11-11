const CACHE_NAME = "codehamza-ag-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./im.hamza.png",
  "./1.png",
  "./2.png",
  "./3.png",
  "./lessons.png",
  "./Serie1.html",
  "./Serie2.html",
  "./Serie3.html",
  "./Serie4.html",
  "./Serie5.html",
  "./Serie6.html",
  "./Serie7.html",
  "./Serie8.html",
  "./Serie9.html",
  "./car1.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
        }
        return response;
      });
    }).catch(() => caches.match("./index.html"))
  );
});