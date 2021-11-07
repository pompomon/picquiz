const staticCache = "picquiz-app";
const oldStaticCache = "picquiz-app";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/config.json",
  "/js/app.js",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCache).then(cache => {
      cache.addAll(assets);
    }).catch(err => console.log(err))
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cacheName) => cacheName === oldStaticCache).map((cacheName) => {
            console.log("Cleaning " + cacheName)
            return caches.delete(cacheName);
          })
        );
      })
    );
  });