import React from 'react';
import { sessionIsValid } from '../../lib/rideSession';

export default function RideLandingPage({ existingSession, onStart, onContinue }) {
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

        <button className="ride-btn ride-btn-primary" onClick={onStart}>
          Start your ride
        </button>

        {hasActiveSession && (
          <button className="ride-btn ride-btn-ghost" onClick={onContinue}>
            Continue my tour →
          </button>
        )}

        <p className="ride-landing-note">No app · No account · Just ride</p>
      </div>
    </div>
  );
}
