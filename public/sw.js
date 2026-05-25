const CACHE_VERSION = 'english-up-v3'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const PAGE_CACHE = `${CACHE_VERSION}-pages`
const ALL_CACHES = [STATIC_CACHE, PAGE_CACHE]

const STATIC_EXTENSIONS = ['.js', '.css', '.woff', '.woff2', '.png', '.jpg', '.svg', '.ico']

const PRECACHE_PAGES = ['/app', '/phrases', '/shadowing', '/conversation']

self.addEventListener('install', (event) => {
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

function isCacheable(response) {
  return response && response.status === 200 && response.type !== 'opaque' && response.type !== 'error'
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Skip: API calls, manifest, sw itself
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/sw.js'
  ) return

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        try {
          const response = await fetch(event.request)
          if (isCacheable(response)) {
            cache.put(event.request, response.clone())
          }
          return response
        } catch {
          return cached ?? new Response('', { status: 503 })
        }
      })
    )
  } else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (isCacheable(response)) {
            caches.open(PAGE_CACHE).then((cache) => {
              try {
                cache.put(event.request, response.clone())
              } catch {}
            })
          }
          return response
        })
        .catch(() => caches.match(event.request))
    )
  }
})
