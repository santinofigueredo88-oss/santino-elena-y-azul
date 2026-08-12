/* Service worker de ¿Qué Cocino?
   Estrategia:
   - Navegación (index.html): network-first, con fallback a la copia en caché
     (así siempre ves la versión nueva cuando hay internet).
   - Resto de recursos same-origin (assets con hash): cache-first, guardando
     en caché cada respuesta correcta de la primera visita.
   Al activarse, se limpian versiones viejas de la caché.
   IMPORTANTE: subí VERSION cuando publiques cambios grandes para forzar
   el refresco de la caché. */
const VERSION = 'que-cocino-v1'
const CACHE = `${VERSION}-shell`

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navegación: primero la red, después la caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((respuesta) => {
          const copia = respuesta.clone()
          caches.open(CACHE).then((c) => c.put(request, copia))
          return respuesta
        })
        .catch(() =>
          caches.match(request).then((r) => r || caches.match('/'))
        )
    )
    return
  }

  // Recursos: caché primero, red como respaldo
  event.respondWith(
    caches.match(request).then((enCache) => {
      const desdeRed = fetch(request).then((respuesta) => {
        if (respuesta && respuesta.ok) {
          const copia = respuesta.clone()
          caches.open(CACHE).then((c) => c.put(request, copia))
        }
        return respuesta
      })
      return enCache || desdeRed
    })
  )
})
