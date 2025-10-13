self.addEventListener('push', event => {
    if(!event.data) return;
  const data = event.data ? event.data.json() : { title: 'Moodlevox', body: 'Something failed.' };

  const options = {
    body: data.body,
    icon: data.icon || 'icon.png',
    badge: data.badge || 'logoFull_black.png',
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data || '/';
  // Focus or open the URL
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
