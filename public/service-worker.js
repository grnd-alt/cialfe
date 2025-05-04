self.addEventListener('push',function(event) {
  self.registration.showNotification(event.data.text(),{})
})
self.addEventListener('message', function(event) {
  self.registration.showNotification(event.data.message,{})
})
self.addEventListener('notificationclick', function() {
  console.log("HELLO WORLD")
})

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('vue-pwa').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/main.js',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
