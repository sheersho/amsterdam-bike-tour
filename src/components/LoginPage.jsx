import React, { useEffect, useState } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';
import { TOUR_PURCHASE_REQUIRED_MESSAGE } from '../lib/api';

export default function LoginPage({
  onRequestAccess,
  initialEmail = '',
  initialError = '',
  title = 'Get Access',
  subtitle = 'Enter your email and we’ll send a secure link that unlocks your tour for 48 hours.',
  helperText = 'Use the same email address you booked with.',
  buttonLabel = 'Get Access',
  supportEmail = 'sheersho.business@gmail.com',
}) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const requiresNewTour = error === TOUR_PURCHASE_REQUIRED_MESSAGE;

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalized = email.trim();

    if (!normalized) {
      setError('Enter your email to continue.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await onRequestAccess(normalized);
      setPreviewLink(response?.magicLink || '');
      setSuccessMessage(response?.message || '');
    } catch (err) {
      setError(err.message || 'Unable to send your access link right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page signup-page">
      <div className="signup-bg-grid" />
      <div className="signup-glow" />

      <div className="signup-content">
        <div className="signup-corner-accent" aria-hidden="true">
          <div className="signup-corner-flag">
            <span />
            <span />
            <span />
          </div>
          <div className="signup-corner-bike">🗺️</div>
        </div>
        <div className="signup-badge">Early Access - Amsterdam City Center Tour</div>
        <h1 className="signup-title">
          Ride <em>smarter.</em>
          <br />
          Start here.
        </h1>
        <p className="signup-copy">{subtitle}</p>

        <div className="login-card signup-card">
          <h2>{title}</h2>
          <p className="login-helper-text">{helperText}</p>

          <form className="login-form signup-form" onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="email">Email</label>
            <div className="signup-form-row">
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input signup-input"
                placeholder="Enter your email address"
                required
              />

              <button type="submit" className="login-btn signup-btn" disabled={submitting}>
                {submitting ? 'Sending...' : buttonLabel}
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}
            {requiresNewTour && (
              <p className="login-support-note">
                This email appears to have an expired session. Please contact admin at{' '}
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
              </p>
            )}
            {successMessage && <p className="login-success">{successMessage}</p>}
            {previewLink && (
              <a className="magic-link-preview" href={previewLink}>
                Open preview access link
              </a>
            )}
          </form>

          <div className="signup-note">No app download · Works in your browser · 48-hour access window</div>

          <div className="signup-stats">
            <div className="signup-stat">
              <div className="signup-stat-num">10</div>
              <div className="signup-stat-label">Story-led stops</div>
            </div>
            <div className="signup-stat">
              <div className="signup-stat-num">14 KM</div>
              <div className="signup-stat-label">City center route</div>
            </div>
            <div className="signup-stat">
              <div className="signup-stat-num">48 hrs</div>
              <div className="signup-stat-label">Flexible access</div>
            </div>
          </div>
        </div>
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
