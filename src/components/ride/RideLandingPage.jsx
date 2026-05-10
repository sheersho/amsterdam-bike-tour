import React from 'react';
import { sessionIsValid } from '../../lib/rideSession';

export default function RideLandingPage({
  existingSession,
  onStart,
  onContinue,
  detecting = false,
  locationDenied = false,
  error = '',
}) {
  const hasActiveSession = existingSession && sessionIsValid(existingSession);

  return (
    <div className="ride-page ride-landing">
      <div className="ride-landing-hero">
        <div className="ride-landing-eyebrow">Bill&apos;s Bike Tour</div>
        <h1 className="ride-landing-title">
          Amsterdam<br />by Bike
        </h1>
        <p className="ride-landing-sub">
          Self-guided · Story-led · Start anywhere
        </p>
      </div>

      <div className="ride-landing-body">
        <div className="ride-landing-feature-row">
          <div className="ride-landing-feature">
            <span className="ride-landing-feature-icon">🗺️</span>
            <span>10 stops</span>
          </div>
          <div className="ride-landing-feature">
            <span className="ride-landing-feature-icon">🚲</span>
            <span>14 km route</span>
          </div>
          <div className="ride-landing-feature">
            <span className="ride-landing-feature-icon">🕐</span>
            <span>48 hrs access</span>
          </div>
        </div>

        {detecting ? (
          <div className="ride-location-card ride-location-detecting">
            <div className="ride-spinner" />
            <p>Finding your nearest stop…</p>
          </div>
        ) : locationDenied ? (
          <div className="ride-location-card">
            <p className="ride-location-desc">
              Location access is required to find your nearest stop.
              Please allow it in your browser settings, then try again.
            </p>
            <button className="ride-btn ride-btn-primary" onClick={onStart}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <button className="ride-btn ride-btn-primary" onClick={onStart}>
              START YOUR RIDE →
            </button>
            {error && <p className="ride-error" style={{ textAlign: 'center', marginTop: 8 }}>{error}</p>}
            {hasActiveSession && (
              <button className="ride-btn ride-btn-ghost" onClick={onContinue}>
                Continue my tour →
              </button>
            )}
          </>
        )}

        <p className="ride-landing-note">No app · No account · Just ride</p>
      </div>
    </div>
  );
}
