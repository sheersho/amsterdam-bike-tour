import { STOPS } from './tourdata';

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

// All 10 stops are entry points
export const ENTRY_POINTS = Object.fromEntries(
  STOPS.map(stop => {
    const id = slugify(stop.name);
    return [id, { id, stopId: stop.id, name: stop.name, lat: stop.lat, lng: stop.lng }];
  })
);

// Canonical tour stop order by ID
const TOUR_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Returns stop IDs in ride order starting from the given entry stop
export function buildRouteFromEntry(entryStopId) {
  const idx = TOUR_ORDER.indexOf(entryStopId);
  if (idx === -1) return TOUR_ORDER;
  return [...TOUR_ORDER.slice(idx), ...TOUR_ORDER.slice(0, idx)];
}

// Returns STOPS objects in ride order for a given entry point id
export function buildStopRouteFromEntry(entryPointId) {
  const ep = ENTRY_POINTS[entryPointId];
  if (!ep) return STOPS;
  const ids = buildRouteFromEntry(ep.stopId);
  return ids.map(id => STOPS.find(s => s.id === id)).filter(Boolean);
}

function deg2rad(d) { return d * (Math.PI / 180); }

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Returns { entryPoint, skipToNext } — skipToNext is true when user is within 50 m of the entry stop
export function nearestEntryPoint(userLat, userLng) {
  let nearest = Object.values(ENTRY_POINTS)[0];
  let minDist = Infinity;
  for (const ep of Object.values(ENTRY_POINTS)) {
    const dist = haversineKm(userLat, userLng, ep.lat, ep.lng);
    if (dist < minDist) { minDist = dist; nearest = ep; }
  }
  return { entryPoint: nearest, skipToNext: minDist < 0.05 };
}

// ─── Server compatibility ────────────────────────────────────────────────────
// The backend API only accepts the original 3 entry point IDs. Map any new
// stop-based entry point to the nearest server-accepted one so the API call
// succeeds. All actual routing remains client-side and ignores this value.
const SERVER_ACCEPTED = {
  central_station: { lat: 52.3791, lng: 4.9003 },
  anne_frank:      { lat: 52.3752, lng: 4.8840 },
  skinny_bridge:   { lat: 52.3637, lng: 4.9024 },
};

export function toServerEntryPointId(entryPointId) {
  if (entryPointId in SERVER_ACCEPTED) return entryPointId;
  const ep = ENTRY_POINTS[entryPointId];
  if (!ep) return 'central_station';
  let nearest = 'central_station';
  let minDist = Infinity;
  for (const [id, coords] of Object.entries(SERVER_ACCEPTED)) {
    const dist = haversineKm(ep.lat, ep.lng, coords.lat, coords.lng);
    if (dist < minDist) { minDist = dist; nearest = id; }
  }
  return nearest;
}

// Universal Google Maps navigation link (works on iOS + Android)
export function mapsNavUrl(destLat, destLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=bicycling`;
}

// Number of free stops from the start of the ride (index 0 and 1)
export const FREE_STOP_COUNT = 2;
