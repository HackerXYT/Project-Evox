const CACHE_NAME = 'jeanne-cache-v48';
const STATIC_ASSETS = [
  '/jeanneBeta/',
  '/jeanneBeta/index.html',
  '/jeanneBeta/main.js',
  '/jeanneBeta/style.css',
  '/jeanneBeta/appLogoV2.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() =>
      self.clients.claim().then(() =>
        self.clients.matchAll().then(clients =>
          clients.forEach(client =>
            client.postMessage({ type: 'CACHE_UPDATED' })
          )
        )
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Allow network passthrough for non-jeanne domains
  if (!url.hostname.endsWith('evoxs.xyz') || url.hostname.startsWith('data.') || url.hostname.startsWith('arc.')) {
    return;
  }

  // Network-first for main.js to get updates
  if (url.pathname.endsWith('main.js')) {
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        let clone;
        if (networkResponse.status !== 206) {
          clone = networkResponse.clone();
        }
        if (clone) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first strategy for other GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(cachedResponse =>
        cachedResponse || fetch(event.request).then(networkResponse => {
          let clone;
          if (networkResponse.status !== 206) {
            clone = networkResponse.clone();
          }
          if (clone) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
      )
    );
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push Notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'appLogoV2.png',
    data: {
      title: data.title,
      content: data.body
    }
  });
});

self.addEventListener('notificationclick', event => {
  const { title, content } = event.notification.data;
  const url = `https://evoxs.xyz/jeanneBeta/?showNotification=true&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});