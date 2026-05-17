/**
 * Phase 2 — Offline cache helpers.
 *
 * Computes the OSM tile URLs that cover all tour route polylines at zoom
 * levels 14-16, plus every audio file URL, then posts a PRELOAD message to
 * the active service worker.  Progress (0-100) is reported via a callback.
 */

import { ROUTE_SEGMENTS } from '../data/routePolylines';

// ─── Tile math ────────────────────────────────────────────────────────────────

function latLngToTile(lat, lng, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { x, y };
}

function tileUrl(x, y, zoom) {
  // Round-robin subdomains a/b/c to spread load and match what Leaflet requests
  const sub = ['a', 'b', 'c'][(x + y) % 3];
  return `https://${sub}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

function tilesForPolyline(coords, zoom) {
  const urls = new Set();
  for (const [lat, lng] of coords) {
    const { x, y } = latLngToTile(lat, lng, zoom);
    // Include a 1-tile buffer so adjacent tiles load without gaps
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        urls.add(tileUrl(x + dx, y + dy, zoom));
      }
    }
  }
  return urls;
}

// ─── Build tile list ──────────────────────────────────────────────────────────

export function buildTileUrls() {
  const urls = new Set();
  const ZOOM_LEVELS = [14, 15, 16];

  for (const segment of Object.values(ROUTE_SEGMENTS)) {
    const lines = [
      ...(segment.curated  ?? []),
      ...(segment.fastest  ?? []),
    ];
    for (const zoom of ZOOM_LEVELS) {
      for (const url of tilesForPolyline(lines, zoom)) {
        urls.add(url);
      }
    }
  }

  return [...urls];
}

// ─── Build audio list ─────────────────────────────────────────────────────────

export function buildAudioUrls() {
  const urls = [];
  for (let stop = 1; stop <= 10; stop++) {
    // Main stop intro audio
    urls.push(`/audio/stops/stop-${stop}.mp3`);
    // Per-section audio (sections 1–6)
    for (let section = 1; section <= 6; section++) {
      urls.push(`/audio/stops/stop-${stop}-${section}.mp3`);
    }
  }
  return urls;
}

// ─── SW registration ──────────────────────────────────────────────────────────

export function isServiceWorkerSupported() {
  return 'serviceWorker' in navigator;
}

export async function registerServiceWorker() {
  if (!isServiceWorkerSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return reg;
  } catch (err) {
    console.warn('[SW] registration failed:', err);
    return null;
  }
}

// ─── Preload trigger ──────────────────────────────────────────────────────────

/**
 * Sends PRELOAD message to the active SW and reports progress.
 *
 * @param {(pct: number) => void} onProgress  called with 0-100
 * @returns {Promise<void>}                   resolves when done or SW unavailable
 */
export async function triggerOfflinePreload(onProgress) {
  if (!isServiceWorkerSupported()) {
    onProgress(100);
    return;
  }

  const sw = navigator.serviceWorker.controller;
  if (!sw) {
    // SW not yet controlling this page (first load); resolve immediately
    onProgress(100);
    return;
  }

  return new Promise((resolve) => {
    const handler = (event) => {
      if (event.data?.type === 'PRELOAD_PROGRESS') {
        onProgress(event.data.pct ?? 0);
      }
      if (event.data?.type === 'PRELOAD_DONE') {
        navigator.serviceWorker.removeEventListener('message', handler);
        onProgress(100);
        resolve();
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);

    sw.postMessage({
      type: 'PRELOAD',
      tiles: buildTileUrls(),
      audioUrls: buildAudioUrls(),
    });
  });
}

// ─── Offline detection ────────────────────────────────────────────────────────

export function isOffline() {
  return !navigator.onLine;
}

export function onConnectivityChange(callback) {
  window.addEventListener('online',  () => callback(true));
  window.addEventListener('offline', () => callback(false));
  return () => {
    window.removeEventListener('online',  callback);
    window.removeEventListener('offline', callback);
  };
}
