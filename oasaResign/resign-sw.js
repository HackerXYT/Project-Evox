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

const STATIC_CACHE_NAME = 'static-cache-v124';
const APP_CACHE_NAME = 'app-cache-v124';
const CACHE_STATIC = [
  '/oasaResign/',
  '/oasaResign/index.html',
  '/oasaResign/style.css',
  '/oasaResign/live.css',
  '/oasaResign/resign.css',
  '/oasaResign/apple.png',
  '/oasaResign/setup.png',
  '/oasaResign/intelligence.js',
  '/oasaResign/intelligence-helpers.js',
  '/oasaResign/intelligence-eventListeners.js',
  '/oasaResign/haptics.js',
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
  '/oasaResign/epsilon-transparent.png'
];
const CACHE_APP = [
  '/oasaResign/intelligence.js'
];

// Build a Set of known static paths for fast lookup in the fetch handler
const CACHE_STATIC_SET = new Set(CACHE_STATIC);

// Install event: pre-cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME),
      caches.open(APP_CACHE_NAME)
    ]).then(([staticCache, appCache]) => {
      return Promise.all([
        staticCache.addAll(CACHE_STATIC),
        appCache.addAll(CACHE_APP)
      ]);
    }).then(() => self.skipWaiting())
  );
});

// Activate event: delete every cache that isn't the current version
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== STATIC_CACHE_NAME && name !== APP_CACHE_NAME)
            .map(name => {
              console.log('Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
    ]).then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ action: 'CACHE_UPDATE_COMPLETED' }));
      });
    })
  );
});

// Fetch event: serve pre-cached assets from cache; everything else goes to network only
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('chrome-extension:')) return;

  const url = new URL(event.request.url);

  const excludedPatterns = [
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=getScheduleDaysMasterline.*/,
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=getDailySchedule.*/,
    /^https:\/\/data\.evoxs\.xyz\/oasa\?intelligence=.*/,
    /^https:\/\/florida\.evoxs\.xyz\/activeSchedo\?username=.*/,
    /^https:\/\/florida\.evoxs\.xyz\/liveNotif\?username=.*/,
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=webGetRoutesDetailsAndStops.*/,
    /^https:\/\/data\.evoxs\.xyz\/proxy\?key=21&targetUrl=.*telematics\.oasa\.gr\/api\/\?act=getStopArrivals.*/
  ];

  if (excludedPatterns.some(pattern => pattern.test(event.request.url))) return;

  if (
    url.pathname.startsWith('/evox-epsilon-beta/Home/dist/') ||
    url.pathname.startsWith('/events/v2') ||
    url.pathname.startsWith('/fonts/v1/mapbox') ||
    url.pathname.startsWith('/map-sessions/v1') ||
    url.pathname.includes('z-oasa-current-version.evox')
  ) return;

  // Only serve from cache for known pre-cached assets; never auto-add to cache
  const isStaticAsset = CACHE_STATIC_SET.has(url.pathname);

  event.respondWith(
    isStaticAsset
      ? caches.match(event.request).then(response => response || fetch(event.request))
      : fetch(event.request).catch(() => caches.match('/oasaResign/offline.html'))
  );
});

async function addResourcesToCache(cache, resources) {
  await Promise.all(resources.map(async resource => {
    try {
      await cache.add(resource);
    } catch (error) {
      console.error(`Failed to add resource to cache: ${resource}`, error);
    }
  }));
}

async function updateCache() {
  // Notify start
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ action: 'CACHE_UPDATE_STARTED' }));

  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => name !== STATIC_CACHE_NAME && name !== APP_CACHE_NAME);

  const [staticCache, appCache] = await Promise.all([
    caches.open(STATIC_CACHE_NAME),
    caches.open(APP_CACHE_NAME)
  ]);

  await Promise.all([
    addResourcesToCache(staticCache, CACHE_STATIC),
    addResourcesToCache(appCache, CACHE_APP)
  ]);

  await Promise.all(oldCaches.map(name => caches.delete(name)));

  console.log('Cache updated and old caches cleared.');

  const updatedClients = await self.clients.matchAll();
  updatedClients.forEach(client => client.postMessage({ action: 'CACHE_UPDATE_COMPLETED' }));
}

// Handle messages from the client to manually update the cache
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'UPDATE_CACHE') {
    event.waitUntil(
      updateCache().then(() => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ action: 'CACHE_UPDATED' }));
        });
      })
    );
  }
});
