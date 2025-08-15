self.addEventListener('push', function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'apple.png'
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://evoxs.xyz/oasaResign/')
  );
});

const STATIC_CACHE_NAME = 'static-cache-v97';
const APP_CACHE_NAME = 'app-cache-v97';
const CACHE_STATIC = [
  '/oasaResign/',
  '/oasaResign/index.html',
  '/oasaResign/style.css',
  '/oasaResign/live.css',
  '/oasaResign/resign.css',
  '/oasaResign/apple.png',
  '/oasaResign/setup.png',
  '/oasaResign/intelligence.js',
  '/oasaResign/recent.png',
  '/oasaResign/personal.png',
  '/oasaResign/reloading-pfp.gif',
  '/oasaResign/evox-logo-dark.png',
  '/oasaResign/jquery-3.7.1.js',
  '/oasaResign/c027bec07c2dc08b9df60921dfd539bd.jpg',
  '/oasaResign/cbimage.png',
  '/oasaResign/error-handling-svgrepo-com.svg',
  '/oasaResign/SFUIText-Medium.ttf',
  '/oasaResign/snap.png',
  '/oasaResign/warning-alert-svgrepo-com.svg',
  '/oasaResign/offline.html',
  '/oasaResign/manifest.json',
  '/oasaResign/arrow-down.svg',
  '/oasaResign/minimized.png',
  '/oasaResign/ready.png',
  '/oasaResign/wave.png',
  '/oasaResign/bus.png',
  '/oasaResign/complete.png',
  '/oasaResign/zzz.png',
  '/evox-epsilon-beta/evox-logo-apple-simple.png',
  '/oasaResign/colorPickr.js',
  '/oasaResign/pickr.css',
  '/oasaResign/settings/carousel.png',
  '/oasaResign/settings/delete.png',
  '/oasaResign/settings/evox.png',
  '/oasaResign/settings/intelli.png',
  '/oasaResign/settings/status.png',
  '/oasaResign/settings/theme.png',
  '/oasaResign/settings/update.png',
  '/oasaResign/settings/version.png',
  '/oasaResign/T7BETA.json',
  '/oasaResign/oasastandalone-white.png',
  '/oasaResign/oasastandalone.png',
  '/oasaResign/oasaP.png',
  '/oasaResign/fonts/Bumbbled.otf',
  '/oasaResign/fonts/sf-pro-display_regular.woff2',
  '/oasaResign/fonts/sf-pro-display_semibold.woff2',
  '/oasaResign/fonts/sf-pro-icons_light.woff2',
  '/oasaResign/fonts/sf-pro-icons_regular.woff2',
  '/oasaResign/fonts/sf-pro-icons_semibold.woff2',
  '/oasaResign/fonts/sf-pro-text_light.woff2',
  '/oasaResign/fonts/sf-pro-text_regular.woff2',
  '/oasaResign/fonts/sf-pro-text_semibold.woff2',
];
const CACHE_APP = [
  '/oasaResign/intelligence.js'
];

// Install event: Cache static and app resources
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME),
      caches.open(APP_CACHE_NAME)
    ]).then(([staticCache, appCache]) => {
      console.log('Caches opened and resources added.');
      return Promise.all([
        staticCache.addAll(CACHE_STATIC),
        appCache.addAll(CACHE_APP)
      ]);
    }).then(() => {
      return self.skipWaiting(); // Activate the new service worker immediately
    })
  );
});

// Activate event: Clean up old caches and claim clients
//self.addEventListener('activate', event => {
//  event.waitUntil(
//    Promise.all([
//      self.clients.claim(), // Take control of all clients immediately
//      caches.keys().then(cacheNames => {
//        return Promise.all(
//          cacheNames.map(cacheName => {
//            if (cacheName !== STATIC_CACHE_NAME && cacheName !== APP_CACHE_NAME) {
//              console.log('Deleting old cache:', cacheName);
//              return caches.delete(cacheName);
//            }
//          })
//        );
//      })
//    ])
//  );
//});

// Fetch event: Serve cached content when offline and update cache with network responses
//self.addEventListener('fetch', event => {
//  event.respondWith(
//    caches.match(event.request).then(response => {
//      if (response) {
//        return response; // Cache hit - return the cached response
//      }
//
//      // Fetch from the network and update the cache
//      return fetch(event.request).then(networkResponse => {
//        if (networkResponse && networkResponse.status === 200) {
//          caches.open(STATIC_CACHE_NAME).then(cache => {
//            cache.put(event.request, networkResponse.clone());
//          });
//        }
//        return networkResponse;
//      }).catch(() => {
//        return caches.match('/oasaResign/offline.html'); // Serve offline page if network fails
//      });
//    })
//  );
//});

// Function to manually update the cache
async function updateCache() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(cacheName => cacheName !== STATIC_CACHE_NAME && cacheName !== APP_CACHE_NAME);

  // Open current caches
  const [staticCache, appCache] = await Promise.all([
    caches.open(STATIC_CACHE_NAME),
    caches.open(APP_CACHE_NAME)
  ]);

  // Add updated resources to the current caches
  await Promise.all([
    staticCache.addAll(CACHE_STATIC),
    appCache.addAll(CACHE_APP)
  ]);

  // Delete old caches
  await Promise.all(oldCaches.map(cacheName => caches.delete(cacheName)));

  console.log('Cache updated and old caches cleared.');
}


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
//self.addEventListener('fetch', event => {
//  // Filter out requests with unsupported schemes
//  if (event.request.url.startsWith('chrome-extension:')) {
//    // Skip caching requests with unsupported schemes
//    return;
//  }
//
//  const url = new URL(event.request.url);
//  if (url.pathname.startsWith('/evox-epsilon-beta/Home/dist/')) {
//    return; // Skip handling requests to this path
//  }
//
//  //console.warn("PATH!", url.pathname)
//  if (url.pathname.startsWith('/events/v2') || url.pathname.startsWith('/fonts/v1/mapbox') || url.pathname.startsWith('/map-sessions/v1')) {
//    return; // Skip handling requests to this path
//  }
//
//  event.respondWith(
//    caches.match(event.request).then(response => {
//      if (response) {
//        return response; // Cache hit - return the cached response
//      }
//
//      // Fetch from the network and update the cache
//      return fetch(event.request).then(networkResponse => {
//        if (networkResponse && networkResponse.status === 200) {
//          // Clone the response because the response stream can only be consumed once
//          const responseClone = networkResponse.clone();
//
//          // Open cache and put the cloned response
//          caches.open(STATIC_CACHE_NAME).then(cache => {
//            if (!event.request.url.startsWith('chrome-extension:')) {
//              cache.put(event.request, responseClone).catch(err => {
//                console.error('Failed to cache the request:', event.request.url, err);
//              });
//            }
//          });
//        }
//        return networkResponse; // Return network response
//      }).catch((error) => {
//        console.warn("SW Fetch failed:", error, event.request)
//        //throw error; // Optionally handle fetch error
//        return caches.match('/oasaResign/offline.html');
//        //return caches.match('/evox-epsilon-beta/ohNoEvoxError.html'); // Serve offline page if network fails
//      });
//    })
//  );
//});

self.addEventListener('fetch', event => {
  // Filter out requests with unsupported schemes
  if (event.request.url.startsWith('chrome-extension:')) {
    return; // Skip handling these requests
  }

  const url = new URL(event.request.url);

  // Define a list of URLs or patterns to exclude
  const excludedPatterns = [
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=getScheduleDaysMasterline.*/,
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=getDailySchedule.*/,
    /^https:\/\/data\.evoxs\.xyz\/oasa\?intelligence=.*/,
    /^https:\/\/florida\.evoxs\.xyz\/activeSchedo\?username=.*/,
    /^https:\/\/florida\.evoxs\.xyz\/liveNotif\?username=.*/,
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=webGetRoutesDetailsAndStops.*/,
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=getStopArrivals.*/
  ];

  // Check if the request URL matches any excluded pattern
  const shouldExclude = excludedPatterns.some(pattern => pattern.test(event.request.url));

  if (shouldExclude) {
    return; // Skip handling these requests
  }

  // Skip handling requests to specific paths
  if (url.pathname.startsWith('/evox-epsilon-beta/Home/dist/') ||
      url.pathname.startsWith('/events/v2') ||
      url.pathname.startsWith('/fonts/v1/mapbox') ||
      url.pathname.startsWith('/map-sessions/v1')||
      url.pathname.includes('z-oasa-current-version.evox')) {
        console.log('Bypassing cache:', url.pathname)
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Cache hit - return the cached response
      }

      // Fetch from the network and update the cache
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();

          caches.open(STATIC_CACHE_NAME).then(cache => {
            if (!event.request.url.startsWith('chrome-extension:')) {
              cache.put(event.request, responseClone).catch(err => {
                console.error('Failed to cache the request:', event.request.url, err);
              });
            }
          });
        }
        return networkResponse;
      }).catch(error => {
        console.warn("SW Fetch failed:", error, event.request);
        return caches.match('/oasaResign/offline.html');
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

