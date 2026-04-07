import React, { useEffect, useState } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';
import { TOUR_PURCHASE_REQUIRED_MESSAGE } from '../lib/api';

export default function AccessPage({
  token,
  onVerify,
  onResend,
  supportEmail = 'sheersho.business@gmail.com',
}) {
  const [status, setStatus] = useState(token ? 'verifying' : 'missing');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const requiresNewTour = error === TOUR_PURCHASE_REQUIRED_MESSAGE;

  const handleComingSoon = () => {
    window.alert('Coming soon.');
  };

  useEffect(() => {
    let cancelled = false;

    async function runVerification() {
      if (!token) {
        setStatus('missing');
        setError('This access link is missing a token. Request a fresh email to continue.');
        return;
      }

      try {
        setStatus('verifying');
        setError('');
        await onVerify(token);
        if (!cancelled) setStatus('success');
      } catch (err) {
        if (cancelled) return;
        setStatus('invalid');
        setError(err.message || 'This access link is invalid or expired.');
      }
    }

    runVerification();

    return () => {
      cancelled = true;
    };
  }, [onVerify, token]);

  const handleResend = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setSuccessMessage('');
      setError('');
      const response = await onResend(email);
      setPreviewLink(response?.magicLink || '');
      setSuccessMessage(
        response?.magicLink
          ? 'New access link created. In local development, you can open the preview link below.'
          : 'A fresh access link is on its way to your inbox.',
      );
      setStatus('resent');
    } catch (err) {
      setError(err.message || 'Unable to resend your link right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="landing-hero login-hero">
        <h1>Checking Your Access</h1>
        <p className="login-subtitle">
          We&apos;re validating your magic link and getting your Amsterdam bike tour ready.
        </p>
      </div>

      <div className="login-card access-card">
        {status === 'verifying' && (
          <>
            <h2>Verifying Link</h2>
            <p className="login-helper-text">
              Hold tight for a moment while we confirm your access.
            </p>
          </>
        )}

        {status !== 'verifying' && (
          <>
            <h2>
              {status === 'success'
                ? 'Access Confirmed'
                : requiresNewTour
                  ? 'Buy A New Tour'
                  : 'Need A Fresh Link?'}
            </h2>
            <p className="login-helper-text">
              {status === 'success'
                ? 'Redirecting you into the tour now.'
                : requiresNewTour
                  ? 'This tour session has expired and can no longer be restored from this link.'
                  : 'This link can no longer be used. Enter your email below and we’ll send a new one.'}
            </p>
          </>
        )}

        {error && <p className="login-error">{error}</p>}
        {successMessage && <p className="login-success">{successMessage}</p>}
        {previewLink && (
          <a className="magic-link-preview" href={previewLink}>
            Open preview access link
          </a>
        )}

        {requiresNewTour && (
          <div className="buy-tour-actions inline-buy-tour-actions">
            <button
              type="button"
              className="login-btn buy-tour-primary"
              onClick={handleComingSoon}
            >
              Buy New Tour
            </button>
            <a className="cta-btn cta-btn-outline buy-tour-secondary" href={`mailto:${supportEmail}`}>
              Contact Admin
            </a>
          </div>
        )}

        {status !== 'verifying' && status !== 'success' && !requiresNewTour && (
          <form className="login-form" onSubmit={handleResend}>
            <label className="login-label" htmlFor="resendEmail">Email</label>
            <input
              id="resendEmail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="login-input"
              placeholder="you@example.com"
              required
            />

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? 'Sending...' : 'Resend Access Link'}
            </button>
          </form>
        )}
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
