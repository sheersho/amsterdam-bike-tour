import React, { useState } from 'react';
import { createCheckout, TOUR_PRICE_DISPLAY } from '../../lib/rideApi';
import { saveReturnUrl } from '../../lib/rideSession';

export default function PaywallPage({ session, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePay() {
    if (!session?.session_id) {
      setError('Session not found. Please restart your ride.');
      return;
    }

    const lastContentUrl = session.last_content_url || window.document.referrer || '/ride';

    try {
      setLoading(true);
      setError('');

      // Persist return URL locally as backup before leaving the app
      saveReturnUrl(lastContentUrl);

      const { checkout_url } = await createCheckout({
        sessionId: session.session_id,
        lastContentUrl,
      });

      // Full-page redirect to Stripe — user returns via success_url
      window.location.href = checkout_url;
    } catch (err) {
      setError(err.message || 'Unable to start checkout. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="ride-page ride-paywall-page">
      <div className="ride-paywall-page-body">
        <div className="ride-paywall-card">
          <div className="ride-paywall-card-icon">🚲</div>
          <h2 className="ride-paywall-card-title">Bill&apos;s Bike Tour</h2>
          <p className="ride-paywall-card-desc">Amsterdam City Centre · 10 stops · 14 km</p>
          <p className="ride-paywall-rating">★ 4.8 · 120+ riders</p>

          <ul className="ride-paywall-includes">
            <li>Full narratives for every stop</li>
            <li>Turn-by-turn Maps navigation</li>
            <li>48 hours of access</li>
            <li>No app needed — opens in browser</li>
          </ul>

          <div className="ride-paywall-divider" />

          <div className="ride-paywall-price-row">
            <span className="ride-paywall-big-price">{TOUR_PRICE_DISPLAY}</span>
            <div className="ride-paywall-price-meta">
              <span className="ride-paywall-one-time">one-time</span>
              <span className="ride-paywall-instant">Instant access</span>
            </div>
          </div>

          {error && <p className="ride-error">{error}</p>}

          <button
            className="ride-btn ride-btn-primary ride-paywall-pay-btn"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? 'Opening checkout…' : `Pay ${TOUR_PRICE_DISPLAY} — Start riding`}
          </button>

          <div className="ride-paywall-trust-row">
            <span>🔒 Secured by Stripe</span>
            <span>👤 No account needed</span>
            <span>⚡ Instant access</span>
          </div>

          <button className="ride-paywall-back-link" onClick={onBack} disabled={loading}>
            ← back
          </button>
        </div>
      </div>
    </div>
  );
}
