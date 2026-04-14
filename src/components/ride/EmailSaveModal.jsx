import React, { useState } from 'react';
import { saveRideEmail } from '../../lib/rideApi';
import { patchSession } from '../../lib/rideSession';

export default function EmailSaveModal({ session, onDone }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;

    try {
      setStatus('saving');
      setError('');
      await saveRideEmail({ sessionId: session.session_id, email: normalized });
      patchSession({ email: normalized, email_prompted: true });
      setStatus('saved');
      // Auto-close after brief success message
      setTimeout(onDone, 1200);
    } catch (err) {
      setError(err.message || 'Could not save email. You can skip this.');
      setStatus('error');
    }
  }

  function handleSkip() {
    patchSession({ email_prompted: true });
    onDone();
  }

  return (
    <div className="ride-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="email-modal-title">
      <div className="ride-modal">
        {status === 'saved' ? (
          <div className="ride-modal-success">
            <div className="ride-modal-success-icon">✓</div>
            <p>Saved! Your tour is ready.</p>
          </div>
        ) : (
          <>
            <h2 id="email-modal-title" className="ride-modal-title">Save your session</h2>
            <p className="ride-modal-desc">
              Get your access link sent to your email so you can resume from any device
              within 48 hours.
            </p>

            <form className="ride-modal-form" onSubmit={handleSave}>
              <input
                type="email"
                className="ride-modal-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {error && <p className="ride-error">{error}</p>}
              <button
                type="submit"
                className="ride-btn ride-btn-primary"
                disabled={status === 'saving'}
              >
                {status === 'saving' ? 'Saving…' : 'Save and continue'}
              </button>
            </form>

            <button className="ride-btn ride-btn-ghost ride-modal-skip" onClick={handleSkip}>
              Skip — I&apos;ll use this device only
            </button>
          </>
        )}
      </div>
    </div>
  );
}
