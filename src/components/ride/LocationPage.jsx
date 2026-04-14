import React, { useState } from 'react';
import { ENTRY_POINTS, nearestEntryPoint, mapsNavUrl } from '../../data/rideRoutes';

// state machine: 'prompt' → 'detecting' → 'detected' | 'denied'
export default function LocationPage({ onEntryPointChosen }) {
  const [state, setState] = useState('prompt');
  const [detectedEp, setDetectedEp] = useState(null);
  const [error, setError] = useState('');

  function requestLocation() {
    if (!navigator.geolocation) {
      setState('denied');
      return;
    }
    setState('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ep = nearestEntryPoint(pos.coords.latitude, pos.coords.longitude);
        setDetectedEp(ep);
        setState('detected');
      },
      () => {
        setState('denied');
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }

  function handleStartHere(ep) {
    onEntryPointChosen(ep);
  }

  return (
    <div className="ride-page ride-location-page">
      <div className="ride-location-header page-header">
        <h1 className="ride-page-title">Find your start</h1>
        <p className="ride-page-subtitle">We&apos;ll point you to the nearest entry point</p>
      </div>

      <div className="ride-location-body">
        {state === 'prompt' && (
          <div className="ride-location-card">
            <div className="ride-location-icon">📍</div>
            <p className="ride-location-desc">
              Allow location access and we&apos;ll open Maps to the closest entry point.
            </p>
            <button className="ride-btn ride-btn-primary" onClick={requestLocation}>
              Use my location
            </button>
            <button className="ride-btn ride-btn-ghost" onClick={() => setState('denied')}>
              Choose manually
            </button>
          </div>
        )}

        {state === 'detecting' && (
          <div className="ride-location-card ride-location-detecting">
            <div className="ride-spinner" />
            <p>Detecting your location…</p>
          </div>
        )}

        {state === 'detected' && detectedEp && (
          <div className="ride-location-card">
            <div className="ride-location-icon">🎯</div>
            <p className="ride-location-nearest-label">Nearest entry point</p>
            <h2 className="ride-location-ep-name">{detectedEp.name}</h2>
            <a
              className="ride-btn ride-btn-maps"
              href={mapsNavUrl(detectedEp.lat, detectedEp.lng)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Maps ↗
            </a>
            <button
              className="ride-btn ride-btn-primary"
              onClick={() => handleStartHere(detectedEp)}
            >
              I&apos;m here · Start ride
            </button>
            <button className="ride-btn ride-btn-ghost" onClick={() => setState('denied')}>
              Choose a different start
            </button>
          </div>
        )}

        {state === 'denied' && (
          <div className="ride-location-manual">
            <p className="ride-location-manual-label">Choose your starting point</p>
            <div className="ride-ep-list">
              {Object.values(ENTRY_POINTS).map((ep) => (
                <div key={ep.id} className="ride-ep-card">
                  <div className="ride-ep-card-info">
                    <span className="ride-ep-card-name">{ep.name}</span>
                  </div>
                  <div className="ride-ep-card-actions">
                    <a
                      className="ride-ep-maps-link"
                      href={mapsNavUrl(ep.lat, ep.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Maps ↗
                    </a>
                    <button
                      className="ride-btn ride-btn-primary ride-ep-start-btn"
                      onClick={() => handleStartHere(ep)}
                    >
                      Start here
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
