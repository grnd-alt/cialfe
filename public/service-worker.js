self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('push',function(event) {
  const data = event.data.json();
  let url = "/me"
  if (data.type === "newPost") {
    url = "/user/"+data.data.author
  }
  self.registration.showNotification(data.title,{body: data.body, data: {url: url}})
})
self.addEventListener('message', function(event) {
  const data = event.json;
  self.registration.showNotification(data.title,{message: data.body})
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
