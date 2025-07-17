self.addEventListener('push', function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'evox-logo-apple.png' // Optional: Add the path to an icon
  });
});

self.addEventListener('notificationclick', function (event) {
  // Access notification data (title and content)
  const title = event.notification.data.title;
  const content = event.notification.data.content;

  // Construct the URL with query parameters
  const url = `https://evoxs.xyz/evox-epsilon-beta/?showNotification=true&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;

  event.notification.close();
  event.waitUntil(
    clients.openWindow(url)
  );
});

const STATIC_CACHE_NAME = 'epsilon-cache-v42';
const APP_CACHE_NAME = 'epsilon-app-cache-v42';
const CACHE_STATIC = [
  '/evox-epsilon-beta/epsilon-frontend-assets/epsilon.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/customize.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/personal.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/background.png',
  '/evox-epsilon-beta/ZKZx.gif',
  '/evox-epsilon-beta/secondary.css',
  '/evox-epsilon-beta/client.css',
  '/scripts/jquery-3.7.0.js',
  '/evox-epsilon-beta/background.css',
  '/evox-epsilon-beta/epsilon-frontend-assets/notifications.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/cypher.png',
  //'/evox-epsilon-beta/evox-epsilon-beta/error.svg',
  '/evox-epsilon-beta/evox-logo-apple.png',
  '/evox-epsilon-beta/devices.min.css',
  '/evox-epsilon-beta/epsilon-frontend-assets/defaultBg.png',
  '/evox-epsilon-beta/tascoPoster.png',
  '/evox-epsilon-beta/owl.carousel.min.css',
  '/evox-epsilon-beta/florida.js',
  '/evox-epsilon-beta/epsilon-frontend-assets/purpleBg.png',
  '/scripts/howler.js',
  '/evox-epsilon-beta/epsilon-backend.js',
  '/evox-epsilon-beta/all.min.css',
  '/evox-epsilon-beta/5512609-hd_1080_1920_25fps.mp4',
  '/evox-epsilon-beta/epsilon-frontend-assets/blueBg.png',
  '/evox-epsilon-beta/epsilon-frontend.js',
  '/evox-epsilon-beta/indicator.css',
  '/evox-epsilon-beta/securelineBanner.png',
  '/evox-epsilon-beta/EvoxEPSILON.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/signin.png',
  '/evox-epsilon-beta/secureline/SF-Pro-Text-Heavy.otf',
  '/evox-epsilon-beta/SFUIText-Medium.ttf',
  '/evox-epsilon-beta/internal/SFProDisplay-Light.ttf',
  '/evox-epsilon-beta/ohNoEvoxError.html',
  '/evox-epsilon-beta/index.html',
  '/evox-epsilon-beta/epsilon-frontend-assets/serviceWorker.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/offlineMode.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/update.png',
  '/evox-epsilon-beta/epsilon-frontend-assets/version.png',
  '/evox-epsilon-beta/sounds/ambient.mp3',
  '/evox-epsilon-beta/sounds/closeProfile.mp3',
  '/evox-epsilon-beta/sounds/confirm.mp3',
  '/evox-epsilon-beta/sounds/openPanel.mp3',
  '/evox-epsilon-beta/sounds/pop.mp3',
  '/evox-epsilon-beta/sounds/submitProfile.mp3',
  '/evox-epsilon-beta/sounds/clickProfile.mp3',
  '/evox-epsilon-beta/sounds/closeSettings.mp3',
  '/evox-epsilon-beta/sounds/openProfile.mp3',
  '/evox-epsilon-beta/sounds/push.mp3',
  '/evox-epsilon-beta/sounds/closePanel.mp3',
  '/evox-epsilon-beta/sounds/completeProfile.mp3',
  '/evox-epsilon-beta/sounds/openSettings.mp3',
  '/evox-epsilon-beta/sounds/rocket.mp3',
  '/evox-epsilon-beta/sounds/pickCategory1.mp3',
  '/evox-epsilon-beta/sounds/pickCategory2.mp3',
  '/evox-epsilon-beta/sounds/launch.mp3',
  '/evox-epsilon-beta/sounds/quitApp.mp3'
];
const CACHE_APP = [
  '/evox-epsilon-beta/epsilon-backend.js',
  '/evox-epsilon-beta/epsilon-frontend.js'
];

// Install event: Cache static and app resources
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME),
      caches.open(APP_CACHE_NAME)
    ]).then(([staticCache, appCache]) => {
      console.log('Caches opened.');
      // Use individual cache.add() with error handling
      return Promise.all([
        addResourcesToCache(staticCache, CACHE_STATIC),
        addResourcesToCache(appCache, CACHE_APP)
      ]);
    }).then(() => {
      return self.skipWaiting(); // Activate the new service worker immediately
    })
  );
});
async function addAllWithLogging(cache, requests) {
  try {
    await cache.addAll(requests);
  } catch (error) {
    console.error('Failed to add some resources to the cache:', error);
  }
}

async function addResourcesToCache(cache, resources) {
  const addPromises = resources.map(async (resource) => {
    try {
      await cache.add(resource);
      console.log(`Resource added to cache: ${resource}`);
    } catch (error) {
      console.error(`Failed to add resource to cache: ${resource}`, error);
    }
  });
  await Promise.all(addPromises);
}


// Activate event: Clean up old caches and claim clients


self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Take control of all clients immediately
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== APP_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                  client.postMessage({ action: 'CACHE_UPDATE_STARTED' });
                });
              });
              setTimeout(function() {
                self.clients.matchAll().then(clients => {
                  clients.forEach(client => {
                    client.postMessage({ action: 'CACHE_UPDATE_COMPLETED' });
                  });
                });
              }, 4000)
              
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

async function updateCache() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(cacheName => cacheName !== STATIC_CACHE_NAME && cacheName !== APP_CACHE_NAME);

  // Notify clients that cache update has started
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ action: 'CACHE_UPDATE_STARTED' });
    });
  });

  // Open current caches
  const [staticCache, appCache] = await Promise.all([
    caches.open(STATIC_CACHE_NAME),
    caches.open(APP_CACHE_NAME)
  ]);

  // Add updated resources to the current caches
  await Promise.all([
    addResourcesToCache(staticCache, CACHE_STATIC),
    addResourcesToCache(appCache, CACHE_APP)
  ]);

  // Delete old caches
  await Promise.all(oldCaches.map(cacheName => caches.delete(cacheName)));

  console.log('Cache updated and old caches cleared.');

  // Notify clients that cache update is complete
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ action: 'CACHE_UPDATE_COMPLETED' });
    });
  });
}

// Fetch event: Serve cached content when offline and update cache with network responses
self.addEventListener('fetch', event => {
  // Filter out requests with unsupported schemes
  if (event.request.url.startsWith('chrome-extension:')) {
    // Skip caching requests with unsupported schemes
    return;
  }

  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/evox-epsilon-beta/Home/dist/')) {
    return; // Skip handling requests to this path
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Cache hit - return the cached response
      }

      // Fetch from the network and update the cache
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          // Clone the response because the response stream can only be consumed once
          const responseClone = networkResponse.clone();

          // Open cache and put the cloned response
          caches.open(STATIC_CACHE_NAME).then(cache => {
            if (!event.request.url.startsWith('chrome-extension:')) {
              cache.put(event.request, responseClone).catch(err => {
                console.error('Failed to cache the request:', event.request.url, err);
              });
            }
          });
        }
        return networkResponse; // Return network response
      }).catch((error) => {

        console.warn("SW Fetch failed:", error)
        throw error; // Optionally handle fetch error
        return;
        //return caches.match('/evox-epsilon-beta/ohNoEvoxError.html'); // Serve offline page if network fails
      });
    })
  );
});

// Handle messages from the client to manually update the cache
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'UPDATE_CACHE') {
    event.waitUntil(
      updateCache().then(() => {
        // Notify the client that the cache update is complete
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ action: 'CACHE_UPDATED' });
          });
        });
      })
    );
  }
});

