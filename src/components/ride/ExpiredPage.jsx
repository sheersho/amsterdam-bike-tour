import React from 'react';
import { clearSession } from '../../lib/rideSession';

export default function ExpiredPage({ onRestart }) {
  function handleRestart() {
    clearSession();
    onRestart();
  }

  return (
    <div className="ride-page ride-expired-page">
      <div className="ride-expired-card">
        <div className="ride-expired-icon">⏰</div>
        <h2>Your tour access has expired</h2>
        <p>
          Your 48-hour access window has ended. Start a new tour to ride again.
        </p>
        <button className="ride-btn ride-btn-primary" onClick={handleRestart}>
          Start a new tour
        </button>
      </div>
    </div>
  );
}
