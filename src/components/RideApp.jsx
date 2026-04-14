import React, { useEffect, useState } from 'react';

import { STOPS } from '../data/tourdata';
import {
  ENTRY_POINTS,
  buildStopRouteFromEntry,
} from '../data/rideRoutes';
import {
  readSession,
  writeSession,
  patchSession,
  isSessionExpired,
  sessionIsValid,
} from '../lib/rideSession';
import { createRideSession, getRideSession } from '../lib/rideApi';

import RideLandingPage from './ride/RideLandingPage';
import LocationPage from './ride/LocationPage';
import RideStopPage from './ride/RideStopPage';
import PaywallPage from './ride/PaywallPage';
import PaymentReturnPage from './ride/PaymentReturnPage';
import EmailSaveModal from './ride/EmailSaveModal';
import ExpiredPage from './ride/ExpiredPage';

// ─── URL helpers ──────────────────────────────────────────────────────────────

function parseRidePath() {
  const pathname = window.location.pathname;
  // Strip /ride prefix and split remainder
  const tail = pathname.replace(/^\/ride\/?/, '').replace(/\/+$/, '');
  const parts = tail.split('/').filter(Boolean);

  if (parts.length === 0) return { type: 'landing' };
  switch (parts[0]) {
    case 'location': return { type: 'location' };
    case 'stop':     return { type: 'stop', stopId: parseInt(parts[1], 10) || null };
    case 'paywall':  return { type: 'paywall' };
    case 'return':   return { type: 'return' };
    case 'expired':  return { type: 'expired' };
    default:         return { type: 'landing' };
  }
}

function rideNavigate(subpath, { replace = false } = {}) {
  const url = subpath ? `/ride/${subpath}` : '/ride';
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// ─── RideApp ─────────────────────────────────────────────────────────────────

export default function RideApp() {
  const [ridePath, setRidePath] = useState(() => parseRidePath());
  const [session, setSession] = useState(() => readSession());
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Keep ridePath in sync with browser navigation (back/forward)
  useEffect(() => {
    const handler = () => setRidePath(parseRidePath());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // On startup: sync session from backend in case the user closed the browser
  // after paying but before /ride/return loaded (webhook fires, localStorage is stale).
  useEffect(() => {
    if (!session?.session_id) return;
    getRideSession(session.session_id)
      .then(serverSession => {
        const updated = patchSession({
          is_paid: serverSession.is_paid,
          paid_at: serverSession.paid_at,
          unlock_expires_at: serverSession.unlock_expires_at,
          stripe_checkout_session_id: serverSession.stripe_checkout_session_id,
          stripe_payment_intent_id: serverSession.stripe_payment_intent_id,
          last_content_url: serverSession.last_content_url || session.last_content_url,
          email: serverSession.email || session.email,
        });
        setSession(updated);
      })
      .catch(() => {}); // non-critical — localStorage values are the fallback
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On landing page load, redirect if session already exists and is valid
  useEffect(() => {
    if (ridePath.type !== 'landing') return;
    if (!session) return;
    if (isSessionExpired(session)) {
      rideNavigate('expired', { replace: true });
      return;
    }
    if (sessionIsValid(session) && session.current_stop_id) {
      rideNavigate(`stop/${session.current_stop_id}`, { replace: true });
    }
  }, [ridePath.type, session]);

  // ── Derived route data ──────────────────────────────────────────────────────

  function getRoute() {
    if (!session?.entry_point) return STOPS;
    return buildStopRouteFromEntry(session.entry_point);
  }

  function getStopById(id) {
    return STOPS.find(s => s.id === id) || null;
  }

  function getCurrentStop() {
    if (ridePath.type === 'stop' && ridePath.stopId) {
      return getStopById(ridePath.stopId);
    }
    return null;
  }

  const route = getRoute();
  const currentStop = getCurrentStop();
  const routeIndex = currentStop ? route.findIndex(s => s.id === currentStop.id) : -1;
  const nextStop = routeIndex >= 0 && routeIndex < route.length - 1
    ? route[routeIndex + 1]
    : null;

  // ── Session creation (called after entry point is chosen) ───────────────────

  async function startSession(entryPoint) {
    try {
      setCreating(true);
      setCreateError('');
      const serverSession = await createRideSession({ entryPoint: entryPoint.id });
      const newSession = {
        session_id: serverSession.session_id,
        entry_point: entryPoint.id,
        entry_source: 'qr_shared',
        is_paid: false,
        paid_at: null,
        unlock_expires_at: null,
        current_stop_id: entryPoint.stopId,
        last_content_url: `/ride/stop/${entryPoint.stopId}`,
        email: null,
        email_prompted: false,
        ...serverSession,
      };
      writeSession(newSession);
      setSession(newSession);
      rideNavigate(`stop/${entryPoint.stopId}`);
    } catch (err) {
      setCreateError(err.message || 'Could not start session. Please check your connection.');
    } finally {
      setCreating(false);
    }
  }

  // ── Navigation handlers ─────────────────────────────────────────────────────

  function handleStart() {
    rideNavigate('location');
  }

  function handleContinueExistingSession() {
    if (session?.current_stop_id) {
      rideNavigate(`stop/${session.current_stop_id}`);
    } else {
      rideNavigate('location');
    }
  }

  function handleEntryPointChosen(ep) {
    startSession(ep);
  }

  function handleContinueToNextStop() {
    if (!nextStop) return;
    const updated = patchSession({
      current_stop_id: nextStop.id,
      last_content_url: `/ride/stop/${nextStop.id}`,
    });
    setSession(updated);
    rideNavigate(`stop/${nextStop.id}`);
  }

  function handlePaywall() {
    if (!currentStop) return;
    // Store the current stop URL before navigating away
    const url = `/ride/stop/${currentStop.id}`;
    const updated = patchSession({ last_content_url: url });
    setSession(updated);
    rideNavigate('paywall');
  }

  function handlePaywallBack() {
    window.history.back();
  }

  function handlePaymentConfirmed(updatedServerSession, returnUrl) {
    const merged = patchSession(updatedServerSession);
    setSession(merged);

    // Navigate to exact page user was on before paywall
    const target = returnUrl.replace(/^https?:\/\/[^/]+/, ''); // strip domain if present
    window.history.replaceState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Show email modal if not already prompted
    if (!merged.email_prompted) {
      setShowEmailModal(true);
    }
  }

  function handleEmailModalDone() {
    setShowEmailModal(false);
    // Re-read session in case email was saved
    setSession(readSession());
  }

  function handleExpiredRestart() {
    setSession(null);
    rideNavigate('', { replace: true });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  // Check expiry on any stop page
  if (ridePath.type === 'stop' && session && isSessionExpired(session)) {
    return <ExpiredPage onRestart={handleExpiredRestart} />;
  }

  if (ridePath.type === 'return') {
    return (
      <PaymentReturnPage onPaymentConfirmed={handlePaymentConfirmed} />
    );
  }

  if (ridePath.type === 'expired') {
    return <ExpiredPage onRestart={handleExpiredRestart} />;
  }

  if (ridePath.type === 'landing') {
    if (creating) {
      return (
        <div className="ride-page ride-loading">
          <div className="ride-spinner" />
          <p>Starting your ride…</p>
        </div>
      );
    }
    return (
      <>
        <RideLandingPage
          existingSession={session}
          onStart={handleStart}
          onContinue={handleContinueExistingSession}
        />
        {createError && <p className="ride-create-error">{createError}</p>}
      </>
    );
  }

  if (ridePath.type === 'location') {
    return (
      <LocationPage onEntryPointChosen={handleEntryPointChosen} />
    );
  }

  if (ridePath.type === 'stop') {
    if (!currentStop) {
      return (
        <div className="ride-page ride-not-found">
          <p>Stop not found.</p>
          <button className="ride-btn ride-btn-primary" onClick={() => rideNavigate('')}>
            Back to start
          </button>
        </div>
      );
    }

    return (
      <>
        <RideStopPage
          stop={currentStop}
          nextStop={nextStop}
          routeIndex={routeIndex}
          routeLength={route.length}
          session={session}
          onContinue={handleContinueToNextStop}
          onPaywall={handlePaywall}
        />
        {showEmailModal && session && (
          <EmailSaveModal session={session} onDone={handleEmailModalDone} />
        )}
      </>
    );
  }

  if (ridePath.type === 'paywall') {
    return (
      <PaywallPage session={session} onBack={handlePaywallBack} />
    );
  }

  // Fallback
  return (
    <div className="ride-page ride-loading">
      <div className="ride-spinner" />
    </div>
  );
}
