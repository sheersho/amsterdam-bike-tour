import { STOPS } from './tourdata';

export const ENTRY_POINTS = {
  central_station: {
    id: 'central_station',
    stopId: 1,
    name: 'Central Station',
    lat: 52.3791,
    lng: 4.9003,
  },
  anne_frank: {
    id: 'anne_frank',
    stopId: 4,
    name: 'Anne Frank House',
    lat: 52.3752,
    lng: 4.8840,
  },
  skinny_bridge: {
    id: 'skinny_bridge',
    stopId: 8,
    name: 'Skinny Bridge',
    lat: 52.3637,
    lng: 4.9024,
  },
};

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

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestEntryPoint(userLat, userLng) {
  let nearest = ENTRY_POINTS.central_station;
  let minDist = Infinity;
  for (const ep of Object.values(ENTRY_POINTS)) {
    const dist = haversineKm(userLat, userLng, ep.lat, ep.lng);
    if (dist < minDist) { minDist = dist; nearest = ep; }
  }
  return nearest;
}

// Universal Google Maps navigation link (works on iOS + Android)
export function mapsNavUrl(destLat, destLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
}

// Number of free stops from the start of the ride (index 0 and 1)
export const FREE_STOP_COUNT = 2;
