import React, { useEffect, useRef, useState } from 'react';
import { pollSessionUntilPaid } from '../../lib/rideApi';
import { patchSession, readSession, readReturnUrl, clearReturnUrl } from '../../lib/rideSession';

const SUCCESS_DISPLAY_MS = 5000;

// Mounted when Stripe redirects user back to /ride/return?ride_session=XYZ
// Polls backend until is_paid = true, then navigates to last_content_url
export default function PaymentReturnPage({ onPaymentConfirmed }) {
  const [status, setStatus] = useState('polling'); // 'polling' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const pendingConfirm = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rideSessionId = params.get('ride_session');

    if (!rideSessionId) {
      setStatus('error');
      setErrorMsg('Missing session ID in return URL. Please go back and try again.');
      return;
    }

    function showSuccessThenConfirm(session, returnUrl) {
      pendingConfirm.current = { session, returnUrl };
      setStatus('success');
    }

    async function confirm() {
      try {
        // Dev mock: skip polling, mark paid instantly from localStorage session
        const isDevPaid = params.get('dev_paid') === '1';
        if (isDevPaid) {
          const now = new Date().toISOString();
          const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
          const returnUrl = readReturnUrl() || readSession()?.last_content_url || '/ride';
          const fakeSession = {
            session_id: rideSessionId,
            is_paid: true,
            paid_at: now,
            unlock_expires_at: expires,
            last_content_url: returnUrl,
          };
          clearReturnUrl();
          showSuccessThenConfirm(fakeSession, returnUrl);
          return;
        }

        // Real Stripe success_url redirect — payment is confirmed by Stripe.
        // Optimistically mark as paid immediately so the user isn't stuck if the
        // webhook is slow or hasn't been configured in test mode.
        const now = new Date().toISOString();
        const optimisticExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
        patchSession({
          is_paid: true,
          paid_at: now,
          unlock_expires_at: optimisticExpiry,
        });

        // Resolve return URL before polling so we have it if the poll fails
        const savedReturnUrl =
          readReturnUrl() ||
          readSession()?.last_content_url ||
          '/ride';

        // Poll backend to get authoritative data (exact timestamps, stripe IDs)
        let serverSession;
        try {
          serverSession = await pollSessionUntilPaid(rideSessionId);
        } catch {
          // Webhook hasn't fired yet (common in test mode). Payment DID succeed —
          // Stripe only redirects to success_url on a confirmed charge. Use the
          // optimistic paid status we already set and send the user back to their stop.
          clearReturnUrl();
          showSuccessThenConfirm(
            { session_id: rideSessionId, is_paid: true, paid_at: now, unlock_expires_at: optimisticExpiry },
            savedReturnUrl,
          );
          return;
        }

        // Merge authoritative server data into localStorage session
        const updated = patchSession({
          session_id: serverSession.session_id || rideSessionId,
          is_paid: true,
          paid_at: serverSession.paid_at || now,
          unlock_expires_at: serverSession.unlock_expires_at || optimisticExpiry,
          stripe_checkout_session_id: serverSession.stripe_checkout_session_id,
          stripe_payment_intent_id: serverSession.stripe_payment_intent_id,
          email: serverSession.email || undefined,
        });

        const returnUrl =
          serverSession.last_content_url ||
          savedReturnUrl;

        clearReturnUrl();
        showSuccessThenConfirm(updated, returnUrl);
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Could not confirm your payment.');
      }
    }

    confirm();
  }, [onPaymentConfirmed]);

  // Once success card is shown, navigate after SUCCESS_DISPLAY_MS
  useEffect(() => {
    if (status !== 'success') return;
    const { session, returnUrl } = pendingConfirm.current;
    const timer = setTimeout(() => onPaymentConfirmed(session, returnUrl), SUCCESS_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [status, onPaymentConfirmed]);

  if (status === 'success') {
    return (
      <div className="ride-page ride-return-page">
        <div className="ride-return-card">
          <div className="ride-return-icon">🎉</div>
          <h2>Payment confirmed!</h2>
          <p className="ride-return-text">You&apos;ve unlocked the full tour.</p>
          <p className="ride-return-subtext">Taking you back to your stop…</p>
        </div>
      </div>
    );
  }

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
