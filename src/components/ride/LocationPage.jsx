import React, { useState } from 'react';
import { ENTRY_POINTS, nearestEntryPoint, mapsNavUrl } from '../../data/rideRoutes';

// state machine: 'prompt' → 'detecting' → 'starting' | 'denied'
export default function LocationPage({ onEntryPointChosen, loading = false, error: startError = '' }) {
  const [state, setState] = useState('prompt');

  function requestLocation() {
    if (!navigator.geolocation) {
      setState('denied');
      return;
    }
    setState('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { entryPoint, skipToNext } = nearestEntryPoint(pos.coords.latitude, pos.coords.longitude);
        setState('starting');
        onEntryPointChosen(entryPoint, skipToNext);
      },
      () => {
        setState('denied');
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }

  function handleStartHere(ep) {
    onEntryPointChosen(ep, false);
  }

  // Show spinner while detecting location or creating session
  if (state === 'detecting' || state === 'starting') {
    return (
      <div className="ride-page ride-location-page">
        <div className="ride-location-body">
          <div className="ride-location-card ride-location-detecting">
            <div className="ride-spinner" />
            <p>{state === 'detecting' ? 'Finding your nearest stop…' : 'Starting your ride…'}</p>
            {startError && (
              <div>
                <p className="ride-error">{startError}</p>
                <button className="ride-btn ride-btn-ghost" onClick={() => setState('prompt')}>Try again</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-page ride-location-page">
      <div className="ride-location-header page-header">
        <h1 className="ride-page-title">Start your ride</h1>
        <p className="ride-page-subtitle">We&apos;ll find the nearest stop to your location</p>
      </div>

      <div className="ride-location-body">
        {state === 'prompt' && (
          <div className="ride-location-card">
            <button className="ride-btn ride-btn-primary ride-btn-start-cta" onClick={requestLocation}>
              START YOUR RIDE &rarr;
            </button>
            <button className="ride-btn ride-btn-ghost" onClick={() => setState('denied')}>
              Choose start manually
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
                    <span className="ride-ep-number">{ep.stopId}</span>
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
                      disabled={loading}
                    >
                      {loading ? 'Starting…' : 'Start here'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {startError && <p className="ride-error" style={{ textAlign: 'center', marginTop: 12 }}>{startError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
