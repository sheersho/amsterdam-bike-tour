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
  purchaseUrl = 'https://toursandtravels.amsterdam',
  supportEmail = 'info@toursandtravels.amsterdam',
}) {
  const [emailId, setEmailId] = useState(initialEmail);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const requiresNewTour = error === TOUR_PURCHASE_REQUIRED_MESSAGE;

  useEffect(() => {
    setEmailId(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalized = emailId.trim();

    if (!normalized) {
      setError('Enter your email to continue.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await onRequestAccess(normalized);
      setPreviewLink(response?.magicLink || '');
      setSuccessMessage(
        response?.magicLink
          ? 'Your link is ready. In local development, you can open the preview link below.'
          : 'Check your inbox for your magic link.',
      );
    } catch (err) {
      setError(err.message || 'Unable to send your access link right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="landing-hero login-hero">
        <h1>Amsterdam Bike Tour</h1>
        <p className="login-subtitle">{subtitle}</p>
      </div>

      <div className="login-card">
        <h2>{title}</h2>
        <p className="login-helper-text">
          {requiresNewTour
            ? 'This access can no longer be restored. Buy a new tour or contact the admin for help.'
            : helperText}
        </p>

        {!requiresNewTour && (
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-label" htmlFor="emailId">Email</label>
            <input
              id="emailId"
              type="email"
              autoComplete="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="login-input"
              placeholder="you@example.com"
              required
            />

            {error && <p className="login-error">{error}</p>}
            {successMessage && <p className="login-success">{successMessage}</p>}
            {previewLink && (
              <a className="magic-link-preview" href={previewLink}>
                Open preview access link
              </a>
            )}

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? 'Sending...' : buttonLabel}
            </button>
          </form>
        )}

        {requiresNewTour && (
          <>
            <p className="login-error">{error}</p>
            <div className="buy-tour-actions inline-buy-tour-actions">
              <a
                className="login-btn buy-tour-primary"
                href={purchaseUrl}
                target="_blank"
                rel="noreferrer"
              >
                Buy New Tour
              </a>
              <a className="cta-btn cta-btn-outline buy-tour-secondary" href={`mailto:${supportEmail}`}>
                Contact Admin
              </a>
            </div>
          </>
        )}
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
