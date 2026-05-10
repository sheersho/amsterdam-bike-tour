import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSegment } from '../../data/routePolylines';
import { mapsNavUrl } from '../../data/rideRoutes';

// ─── Leaflet icon fix (webpack / vite asset paths) ───────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Custom icons ─────────────────────────────────────────────────────────────

function makeStopIcon(label, isActive) {
  return L.divIcon({
    className: '',
    html: `<div class="nav-stop-marker ${isActive ? 'nav-stop-marker--active' : ''}">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

const gpsIcon = L.divIcon({
  className: '',
  html: '<div class="nav-gps-dot"><div class="nav-gps-pulse"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ─── Map re-center helper ─────────────────────────────────────────────────────

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom ?? map.getZoom(), { animate: true });
  }, [center, zoom, map]);
  return null;
}

// ─── NavigationPage ───────────────────────────────────────────────────────────

export default function NavigationPage({
  currentStop,
  nextStop,
  route = [],
  routeIndex = 0,
  routeLength = 10,
  onArrival,
  onBack,
}) {
  const [gpsPos, setGpsPos] = useState(null);
  const [gpsError, setGpsError] = useState(false);
  const [routeType, setRouteType] = useState('curated'); // 'curated' | 'fastest'
  const [mapCenter, setMapCenter] = useState(null);
  const watchIdRef = useRef(null);

  const segment = currentStop && nextStop
    ? getSegment(currentStop.id, nextStop.id)
    : null;

  // Default map centre: midpoint of the segment or current stop
  const defaultCenter = segment
    ? midpoint(segment.curated)
    : currentStop
      ? [currentStop.lat, currentStop.lng]
      : [52.3731, 4.8922]; // Amsterdam centre fallback

  // ── GPS watch ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const latlng = [pos.coords.latitude, pos.coords.longitude];
        setGpsPos(latlng);
        setGpsError(false);
      },
      () => setGpsError(true),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleCentreOnMe = useCallback(() => {
    if (gpsPos) setMapCenter([...gpsPos]); // force re-render
  }, [gpsPos]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const activeLine  = segment ? segment[routeType] : [];
  const inactiveLine = segment
    ? segment[routeType === 'curated' ? 'fastest' : 'curated']
    : [];

  const progressPct = routeLength > 1
    ? Math.round((routeIndex / (routeLength - 1)) * 100)
    : 100;

  const mapsHref = nextStop ? mapsNavUrl(nextStop.lat, nextStop.lng) : '#';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="nav-page">
      {/* ── Map ── */}
      <div className="nav-map-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={15}
          className="nav-map"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {mapCenter && <MapController center={mapCenter} zoom={16} />}

          {/* Inactive route (dimmed) */}
          {inactiveLine.length > 1 && (
            <Polyline
              positions={inactiveLine}
              pathOptions={{ color: '#aaaaaa', weight: 4, opacity: 0.5, dashArray: '6 4' }}
            />
          )}

          {/* Active route */}
          {activeLine.length > 1 && (
            <Polyline
              positions={activeLine}
              pathOptions={{
                color: routeType === 'curated' ? '#E85C1A' : '#555555',
                weight: 5,
                opacity: 0.9,
              }}
            />
          )}

          {/* Stop markers */}
          {route.map((stop, idx) => (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={makeStopIcon(idx + 1, stop.id === currentStop?.id || stop.id === nextStop?.id)}
            >
              <Popup>
                <strong>{stop.name}</strong>
                {stop.id === currentStop?.id && <div className="nav-popup-tag">You are here</div>}
                {stop.id === nextStop?.id && <div className="nav-popup-tag nav-popup-tag--next">Next stop</div>}
              </Popup>
            </Marker>
          ))}

          {/* Live GPS dot */}
          {gpsPos && (
            <Marker position={gpsPos} icon={gpsIcon} zIndexOffset={1000} />
          )}
        </MapContainer>

        {/* Route type toggle */}
        <div className="nav-route-toggle">
          <button
            className={`nav-toggle-btn ${routeType === 'curated' ? 'nav-toggle-btn--active' : ''}`}
            onClick={() => setRouteType('curated')}
          >
            🟠 Scenic
          </button>
          <button
            className={`nav-toggle-btn ${routeType === 'fastest' ? 'nav-toggle-btn--active' : ''}`}
            onClick={() => setRouteType('fastest')}
          >
            ⚫ Fastest
          </button>
        </div>

        {/* Centre-on-me button */}
        <button className="nav-centre-btn" onClick={handleCentreOnMe} title="Centre on my location">
          {gpsError ? '⚠️' : '📍'}
        </button>

        {/* Back button */}
        <button className="nav-back-btn" onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* ── Info panel ── */}
      <div className="nav-panel">
        {/* Progress bar */}
        <div className="nav-progress-bar">
          <div className="nav-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="nav-progress-label">
          Stop {routeIndex + 1} of {routeLength} · {progressPct}% complete
        </div>

        {/* Current / Next stops */}
        <div className="nav-stops-row">
          <div className="nav-stop-info">
            <span className="nav-stop-tag">Now</span>
            <span className="nav-stop-name">{currentStop?.name ?? '—'}</span>
          </div>
          <div className="nav-stop-arrow">→</div>
          <div className="nav-stop-info">
            <span className="nav-stop-tag nav-stop-tag--next">Next</span>
            <span className="nav-stop-name">{nextStop?.name ?? 'Tour complete'}</span>
          </div>
        </div>

        {/* Instruction */}
        {segment && (
          <div className="nav-instruction">
            <span className="nav-instruction-icon">🚲</span>
            <span>{segment.instruction}</span>
          </div>
        )}

        {/* Distance + time */}
        {segment && (
          <div className="nav-meta">
            <span>{formatDist(segment.distance)}</span>
            <span className="nav-meta-sep">·</span>
            <span>~{segment.duration} min</span>
          </div>
        )}

        {/* GPS status */}
        {gpsError && (
          <div className="nav-gps-warning">
            ⚠️ Location unavailable — enable GPS for live tracking
          </div>
        )}

        {/* Actions */}
        <div className="nav-actions">
          <button
            className="nav-btn nav-btn-arrived"
            onClick={onArrival}
            disabled={!nextStop}
          >
            {nextStop ? `✅ I've arrived at ${nextStop.name}` : '🏁 Tour complete!'}
          </button>

          <a
            className="nav-btn nav-btn-maps"
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Maps ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function midpoint(coords) {
  if (!coords || coords.length === 0) return [52.3731, 4.8922];
  const mid = Math.floor(coords.length / 2);
  return coords[mid];
}

function formatDist(metres) {
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1)} km`
    : `${metres} m`;
}
