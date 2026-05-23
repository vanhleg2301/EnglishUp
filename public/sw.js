const CACHE_VERSION = 'english-up-v2'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const PAGE_CACHE = `${CACHE_VERSION}-pages`
const ALL_CACHES = [STATIC_CACHE, PAGE_CACHE]

// Static assets: JS, CSS, fonts, images — cache-first (nội dung không đổi giữa deploy)
const STATIC_EXTENSIONS = ['.js', '.css', '.woff', '.woff2', '.png', '.jpg', '.svg', '.ico']

// Pages pre-cached khi install
const PRECACHE_PAGES = ['/app', '/lesson/1', '/phrases', '/shadowing', '/conversation']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll(PRECACHE_PAGES))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => !ALL_CACHES.includes(key)).map((key) => caches.delete(key)))
    )
  )
  self.clients.claim()
})

function isStaticAsset(url) {
  return STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('/api/')) return

  const url = new URL(event.request.url)

  if (isStaticAsset(url)) {
    // Static assets: cache-first (JS/CSS có hash trong tên file, nội dung bất biến)
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        const response = await fetch(event.request)
        if (response && response.status === 200) {
          cache.put(event.request, response.clone())
        }
        return response
      })
    )
  } else {
    // Pages: network-first — luôn lấy mới, fallback cache khi offline
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            caches.open(PAGE_CACHE).then((cache) => cache.put(event.request, response.clone()))
          }
          return response
        })
        .catch(() => caches.match(event.request))
    )
  }
})
