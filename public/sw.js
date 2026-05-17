// Bill's Bike Tour — Service Worker (Phase 2: Offline Maps)
const CACHE_VERSION = 'v2';
const TILE_CACHE    = `tiles-${CACHE_VERSION}`;
const AUDIO_CACHE   = `audio-${CACHE_VERSION}`;
const SHELL_CACHE   = `shell-${CACHE_VERSION}`;

const KNOWN_CACHES = [TILE_CACHE, AUDIO_CACHE, SHELL_CACHE];

// ─── Install: claim immediately ───────────────────────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(SHELL_CACHE)); // open eagerly so it exists
});

// ─── Activate: delete old caches ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !KNOWN_CACHES.includes(k))
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

// ─── Fetch: route by request type ────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // OSM map tiles — cache-first
  if (isOsmTile(url)) {
    event.respondWith(tileFirst(request));
    return;
  }

  // Audio files — cache-first
  if (isAudioFile(url)) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE));
    return;
  }

  // API calls — network-only (never cache)
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    // Let tiles and audio pass through to their handlers above;
    // everything else from a foreign origin goes straight to network.
    return;
  }

  // App shell (same-origin JS/CSS/HTML) — network-first, fall back to cache
  event.respondWith(networkFirstShell(request));
});

// ─── Message: on-demand preload ───────────────────────────────────────────────
self.addEventListener('message', async (event) => {
  if (event.data?.type !== 'PRELOAD') return;

  const { tiles = [], audioUrls = [] } = event.data;
  const client = event.source;

  let done = 0;
  const total = tiles.length + audioUrls.length;

  function notify(pct) {
    client?.postMessage({ type: 'PRELOAD_PROGRESS', pct });
  }

  // Cache tiles
  const tileCache = await caches.open(TILE_CACHE);
  for (const tileUrl of tiles) {
    try {
      const cached = await tileCache.match(tileUrl);
      if (!cached) {
        const res = await fetch(tileUrl, { mode: 'cors' });
        if (res.ok) await tileCache.put(tileUrl, res);
      }
    } catch {
      // non-fatal: network unavailable, skip this tile
    }
    done++;
    notify(Math.round((done / total) * 100));
  }

  // Cache audio
  const audioCache = await caches.open(AUDIO_CACHE);
  for (const audioUrl of audioUrls) {
    try {
      const cached = await audioCache.match(audioUrl);
      if (!cached) {
        const res = await fetch(audioUrl);
        if (res.ok) await audioCache.put(audioUrl, res);
      }
    } catch {
      // non-fatal
    }
    done++;
    notify(Math.round((done / total) * 100));
  }

  client?.postMessage({ type: 'PRELOAD_DONE' });
});

// ─── Strategy helpers ─────────────────────────────────────────────────────────

function isOsmTile(url) {
  return (
    url.hostname.endsWith('tile.openstreetmap.org') ||
    url.hostname.endsWith('openstreetmap.org')
  ) && url.pathname.match(/\/\d+\/\d+\/\d+\.png$/);
}

function isAudioFile(url) {
  return url.hostname === self.location.hostname &&
    url.pathname.match(/\.(mp3|ogg|wav|m4a)$/i);
}

async function tileFirst(request) {
  const cache = await caches.open(TILE_CACHE);
  // Use the URL string as cache key — avoids Request object mode conflicts
  const cached = await cache.match(request.url);
  if (cached) return cached;
  try {
    // Fetch by URL only (not the Request object) so we can control mode/credentials
    const response = await fetch(request.url, { mode: 'cors', credentials: 'omit' });
    if (response.ok) cache.put(request.url, response.clone());
    return response;
  } catch {
    // Offline and not cached — pass through to network (Leaflet will show grey tile)
    return fetch(request).catch(() => new Response('', { status: 503 }));
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('', { status: 503 });
  }
}

async function networkFirstShell(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached ?? new Response('', { status: 503 });
  }
}
