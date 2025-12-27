self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("qr-cache").then(cache =>
      cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js"
      ])
    )
  );
});
