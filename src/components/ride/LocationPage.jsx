import React, { useState } from 'react';
import { nearestEntryPoint } from '../../data/rideRoutes';

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

  if (state === 'denied') {
    return (
      <div className="ride-page ride-location-page">
        <div className="ride-location-header page-header">
          <h1 className="ride-page-title">Location needed</h1>
          <p className="ride-page-subtitle">We need your location to find the nearest stop and start your ride.</p>
        </div>
        <div className="ride-location-body">
          <div className="ride-location-card">
            <p className="ride-location-desc">
              Please allow location access in your browser settings, then try again.
            </p>
            <button className="ride-btn ride-btn-primary ride-btn-start-cta" onClick={requestLocation}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-page ride-location-page">
      <div className="ride-location-header page-header">
        <h1 className="ride-page-title">Start your ride</h1>
        <p className="ride-page-subtitle">We&apos;ll route you to the nearest stop</p>
      </div>
      <div className="ride-location-body">
        <div className="ride-location-card">
          <button className="ride-btn ride-btn-primary ride-btn-start-cta" onClick={requestLocation}>
            START YOUR RIDE &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
