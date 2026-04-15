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
          <div className="ride-paywall-stars">
            <span className="ride-paywall-star-icons">★★★★★</span>
            <span className="ride-paywall-star-label">4.8 · 120+ riders</span>
          </div>

          <ul className="ride-paywall-includes">
            <li>
              Audio &amp; story at every stop
              <span className="ride-paywall-badge ride-paywall-badge-green">IMPROVED</span>
            </li>
            <li>Turn-by-turn Maps navigation</li>
            <li>No app needed — opens in browser</li>
            <li>48-hour access after purchase</li>
          </ul>

          <div className="ride-paywall-divider" />

          <div className="ride-paywall-price-row">
            <div>
              <span className="ride-paywall-big-price">{TOUR_PRICE_DISPLAY}</span>
              <p className="ride-paywall-price-sub">one-time · Instant access</p>
            </div>
            <span className="ride-paywall-badge ride-paywall-badge-green">Best value</span>
          </div>

          {error && <p className="ride-error">{error}</p>}

          <button
            className="ride-btn ride-btn-primary ride-paywall-pay-btn"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? 'Opening checkout…' : `Pay ${TOUR_PRICE_DISPLAY} — Start riding`}
          </button>

          <p className="ride-paywall-trust-row">
            🔒 Stripe secured · No account needed · Instant access
          </p>

          <button className="ride-paywall-back-link" onClick={onBack} disabled={loading}>
            ← back
          </button>
        </div>
      </div>
    </div>
  );
}
