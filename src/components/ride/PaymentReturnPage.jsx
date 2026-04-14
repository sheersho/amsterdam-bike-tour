import React, { useEffect, useState } from 'react';
import { pollSessionUntilPaid } from '../../lib/rideApi';
import { patchSession, readReturnUrl, clearReturnUrl } from '../../lib/rideSession';

// Mounted when Stripe redirects user back to /ride/return?ride_session=XYZ
// Polls backend until is_paid = true, then navigates to last_content_url
export default function PaymentReturnPage({ onPaymentConfirmed }) {
  const [status, setStatus] = useState('polling'); // 'polling' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rideSessionId = params.get('ride_session');

    if (!rideSessionId) {
      setStatus('error');
      setErrorMsg('Missing session ID in return URL. Please go back and try again.');
      return;
    }

    async function confirm() {
      try {
        // Dev mock: skip polling, mark paid instantly from localStorage session
        const isDevPaid = params.get('dev_paid') === '1';
        if (isDevPaid) {
          const now = new Date().toISOString();
          const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
          const fakeSession = {
            session_id: rideSessionId,
            is_paid: true,
            paid_at: now,
            unlock_expires_at: expires,
            last_content_url: readReturnUrl() || '/ride',
          };
          clearReturnUrl();
          onPaymentConfirmed(fakeSession, fakeSession.last_content_url);
          return;
        }

        // Poll backend until webhook has fired and is_paid is true
        const serverSession = await pollSessionUntilPaid(rideSessionId);

        // Merge server data into localStorage session
        const updated = patchSession({
          session_id: serverSession.session_id || rideSessionId,
          is_paid: true,
          paid_at: serverSession.paid_at,
          unlock_expires_at: serverSession.unlock_expires_at,
          stripe_checkout_session_id: serverSession.stripe_checkout_session_id,
          stripe_payment_intent_id: serverSession.stripe_payment_intent_id,
          email: serverSession.email || undefined,
        });

        // Resolve return URL: backend is authoritative, localStorage is fallback
        const returnUrl =
          serverSession.last_content_url ||
          readReturnUrl() ||
          '/ride';

        clearReturnUrl();
        onPaymentConfirmed(updated, returnUrl);
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Could not confirm your payment.');
      }
    }

    confirm();
  }, [onPaymentConfirmed]);

  if (status === 'error') {
    // Graceful recovery: try returning to last known URL from localStorage
    const fallbackUrl = readReturnUrl() || '/ride';
    return (
      <div className="ride-page ride-return-page">
        <div className="ride-return-card">
          <div className="ride-return-icon">⚠️</div>
          <h2>Payment confirmation delayed</h2>
          <p>{errorMsg}</p>
          <p className="ride-return-hint">
            Your payment may still have gone through. Try refreshing or returning to your tour.
          </p>
          <button
            className="ride-btn ride-btn-primary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
          <a className="ride-btn ride-btn-ghost" href={fallbackUrl}>
            Return to tour
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-page ride-return-page">
      <div className="ride-return-card">
        <div className="ride-spinner ride-return-spinner" />
        <p className="ride-return-text">Confirming your payment…</p>
        <p className="ride-return-subtext">This takes just a moment.</p>
      </div>
    </div>
  );
}
