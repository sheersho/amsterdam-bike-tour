import React, { useEffect, useState } from 'react';
import './styles/App.css';
import './styles/ride.css';
import { FAQ, STOPS } from './data/tourdata';

import LandingPage from './components/LandingPage';
import AllStopsPage from './components/AllStopsPage';
import StopPage from './components/StopPage';
import LoginPage from './components/LoginPage';
import AccessPage from './components/AccessPage';
import NearestStopPage from './components/NearestStopPage';
import RideApp from './components/RideApp';
import {
  fetchTourContent,
  fetchTourStatus,
  isPurchaseRequiredError,
  normalizeEmail,
  requestMagicLink,
  TOUR_PURCHASE_REQUIRED_MESSAGE,
  verifyMagicToken,
} from './lib/api';
import { getRideConfig } from './lib/rideApi';

// Current storage key
const TOUR_TOKEN_KEY = 'tour-auth-token';
const TOUR_LAST_EMAIL_KEY = 'tour-last-email';

// Legacy keys kept only to clear stale data on login
const LEGACY_TOUR_TOKEN_KEY = 'tour-token';
const LEGACY_TOUR_EMAIL_KEY = 'tour-email';
const LEGACY_TOUR_AUTH_EXPIRY_KEY = 'tour-auth-expiry';

// Named page identifiers — avoids scattered magic strings throughout render
const PAGE = {
  LANDING: 'landing',
  STOP: 'stop',
  ALL_STOPS: 'allStops',
};

function clearAuthStorage() {
  localStorage.removeItem(TOUR_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOUR_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOUR_EMAIL_KEY);
  localStorage.removeItem(LEGACY_TOUR_AUTH_EXPIRY_KEY);
}

function saveAuthToken(token) {
  localStorage.setItem(TOUR_TOKEN_KEY, token);
}

function saveLastEmail(email) {
  const normalized = normalizeEmail(email);
  if (normalized) localStorage.setItem(TOUR_LAST_EMAIL_KEY, normalized);
}

function readLastEmail() {
  return localStorage.getItem(TOUR_LAST_EMAIL_KEY) || '';
}

function readStoredToken() {
  return localStorage.getItem(TOUR_TOKEN_KEY) || localStorage.getItem(LEGACY_TOUR_TOKEN_KEY) || '';
}

function getRoute() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const authOff = searchParams.get('auth') === 'off';
  if (pathname === '/ride' || pathname.startsWith('/ride/')) {
    return { path: '/ride', authOff: false };
  }

  if (pathname === '/access') {
    return {
      path: '/access',
      token: new URLSearchParams(window.location.search).get('token') || '',
      authOff,
    };
  }

  if (pathname === '/tour') {
    return { path: '/tour', authOff };
  }

  if (pathname === '/nearest-stop') {
    return { path: '/nearest-stop', authOff };
  }

  return { path: '/', authOff };
}

function updateLocation(path, { replace = false } = {}) {
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function buildTourContent(payload) {
  return {
    stops: Array.isArray(payload?.waypoints) ? payload.waypoints : STOPS,
    faq: Array.isArray(payload?.faq) ? payload.faq : FAQ,
  };
}

function isLocalDev() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

function expireSession(setAuthToken, setAuthState, setExpiredEmail, email) {
  clearAuthStorage();
  if (email) saveLastEmail(email);
  setAuthToken('');
  setAuthState('anonymous');
  setExpiredEmail(email || readLastEmail());
}

export default function App() {
  const [route, setRoute] = useState(() => getRoute());
  const isDevBypass = isLocalDev() && !route.authOff;
  const [authToken, setAuthToken] = useState(() => readStoredToken());
  const [authState, setAuthState] = useState(() => (readStoredToken() ? 'checking' : 'anonymous'));
  const [expiredEmail, setExpiredEmail] = useState(() => readLastEmail());
  const [pendingRoute, setPendingRoute] = useState(null);
  const [page, setPage] = useState(PAGE.LANDING);
  const [currentStop, setCurrentStop] = useState(0);
  const [tourContent, setTourContent] = useState(() => ({ stops: STOPS, faq: FAQ }));
  const [contentState, setContentState] = useState({ status: 'idle', error: '' });
  const [contentReloadCount, setContentReloadCount] = useState(0);
  const [authInlineError, setAuthInlineError] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const feedbackLink = "https://forms.gle/2xmXFyHcSLPrvoBJA";
  const isAuthenticated = authState === 'authenticated' && Boolean(authToken);
  const canAccessTour = isAuthenticated || isDevBypass || !paymentsEnabled;
  const currentYear = new Date().getFullYear();
  const copyrightLabel = currentYear > 2026
    ? `© Meeus Consulting 2026-${currentYear}`
    : '© Meeus Consulting 2026';

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoute());
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    getRideConfig()
      .then(config => setPaymentsEnabled(config.payments_enabled !== false))
      .catch(() => {}); // default to enabled on failure
  }, []);

  useEffect(() => {
    if (!authToken) return;

    let cancelled = false;

    async function validateSession() {
      try {
        setAuthState('checking');
        await fetchTourStatus(authToken);
        if (cancelled) return;
        setAuthInlineError('');
        setAuthState('authenticated');
      } catch (error) {
        if (cancelled) return;
        if (error.status === 401) {
          expireSession(setAuthToken, setAuthState, setExpiredEmail);
          setAuthInlineError('');
          updateLocation('/tour', { replace: true });
          return;
        }

        if (isPurchaseRequiredError(error)) {
          expireSession(setAuthToken, setAuthState, setExpiredEmail);
          setAuthInlineError(TOUR_PURCHASE_REQUIRED_MESSAGE);
          updateLocation('/tour', { replace: true });
          return;
        }

        setAuthInlineError('');
        setAuthState('anonymous');
      }
    }

    validateSession();

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  useEffect(() => {
    if (route.path !== '/tour') return;
    if (!canAccessTour) return;
    if (!isDevBypass && paymentsEnabled && authState !== 'authenticated') return;

    let cancelled = false;

    async function loadTour() {
      if ((isDevBypass || !paymentsEnabled) && !authToken) {
        setTourContent({ stops: STOPS, faq: FAQ });
        setContentState({ status: 'ready', error: '' });
        return;
      }

      try {
        setContentState({ status: 'loading', error: '' });
        const payload = await fetchTourContent(authToken);
        if (cancelled) return;
        setTourContent(buildTourContent(payload));
        setContentState({ status: 'ready', error: '' });
        setAuthInlineError('');
      } catch (error) {
        if (cancelled) return;
        if (error.status === 401) {
          expireSession(setAuthToken, setAuthState, setExpiredEmail);
          setAuthInlineError('');
          updateLocation('/tour', { replace: true });
          return;
        }

        if (isPurchaseRequiredError(error)) {
          expireSession(setAuthToken, setAuthState, setExpiredEmail);
          setAuthInlineError(TOUR_PURCHASE_REQUIRED_MESSAGE);
          updateLocation('/tour', { replace: true });
          return;
        }

        if (isLocalDev()) {
          setTourContent({ stops: STOPS, faq: FAQ });
          setContentState({ status: 'ready', error: '' });
          return;
        }

        setContentState({
          status: 'error',
          error: error.message || 'Unable to load your tour right now.',
        });
      }
    }

    loadTour();

    return () => {
      cancelled = true;
    };
  }, [authState, authToken, canAccessTour, contentReloadCount, isDevBypass, paymentsEnabled, route.path]);

  const goToStop = (i) => {
    setCurrentStop(i);
    setPage(PAGE.STOP);
    if (route.path !== '/tour') {
      updateLocation('/tour');
    }
    window.scrollTo(0, 0);
  };

  const goToAllStops = () => {
    if (!canAccessTour) {
      setPendingRoute({ page: PAGE.ALL_STOPS });
      updateLocation('/tour');
      window.scrollTo(0, 0);
      return;
    }

    setPage(PAGE.ALL_STOPS);
    if (route.path !== '/tour') {
      updateLocation('/tour');
    }
    window.scrollTo(0, 0);
  };

  const goToNearestStart = () => {
    updateLocation('/nearest-stop');
    window.scrollTo(0, 0);
  };

  const finishAuth = ({ email, token }) => {
    saveAuthToken(token);
    saveLastEmail(email);
    setAuthToken(token);
    setAuthState('authenticated');
    setExpiredEmail('');
    setAuthInlineError('');
    setShowWelcomeModal(true);
    updateLocation('/tour', { replace: true });

    if (pendingRoute?.page === PAGE.STOP) {
      setCurrentStop(pendingRoute.stopIndex ?? 0);
      setPage(PAGE.STOP);
    } else if (pendingRoute?.page === PAGE.ALL_STOPS) {
      setPage(PAGE.ALL_STOPS);
    } else {
      setPage(PAGE.LANDING);
    }

    setPendingRoute(null);
    window.scrollTo(0, 0);
  };

  const handleRequestAccess = async (email) => {
    try {
      const response = await requestMagicLink(email);
      saveLastEmail(email);
      setExpiredEmail(normalizeEmail(email));
      setAuthInlineError('');
      return response;
    } catch (error) {
      if (isPurchaseRequiredError(error)) {
        saveLastEmail(email);
        setExpiredEmail(normalizeEmail(email));
        setAuthInlineError(TOUR_PURCHASE_REQUIRED_MESSAGE);
      }
      throw error;
    }
  };

  const handleVerifyAccess = async (token) => {
    const response = await verifyMagicToken(token);
    finishAuth({
      email: response.email,
      token,
    });
    return response;
  };

  const handleLogout = () => {
    clearAuthStorage();
    setAuthToken('');
    setAuthState('anonymous');
    setAuthInlineError('');
    setShowWelcomeModal(false);
    setPendingRoute(null);
    setPage(PAGE.LANDING);
    updateLocation('/', { replace: true });
    window.scrollTo(0, 0);
  };

  const stops = tourContent.stops;
  const faq = tourContent.faq;

  // True once the user is authorised and tour data has loaded
  const isTourReady = route.path === '/tour' && canAccessTour && contentState.status === 'ready';

  // Ride flow gets its own isolated shell — no legacy header/footer/buttons
  if (route.path === '/ride') {
    return (
      <div className="app">
        <RideApp />
      </div>
    );
  }

  return (
    <div className="app">
      {route.path === '/' && (
        <LandingPage
          faq={FAQ}
          onViewAll={goToAllStops}
          onStopByStop={() => updateLocation('/ride')}
          onFindNearestStart={goToNearestStart}
        />
      )}

      {route.path === '/nearest-stop' && (
        <NearestStopPage
          stops={stops}
          onBack={() => {
            updateLocation('/', { replace: true });
            window.scrollTo(0, 0);
          }}
        />
      )}

      {route.path === '/access' && (
        <AccessPage
          token={route.token}
          onVerify={handleVerifyAccess}
          onResend={handleRequestAccess}
        />
      )}

      {route.path === '/tour' && !canAccessTour && page !== PAGE.STOP && page !== PAGE.ALL_STOPS && (
        <LoginPage
          onRequestAccess={handleRequestAccess}
          initialEmail={expiredEmail}
          title="Sign Up to Get Access Code"
          subtitle="Sign up with your email and we'll send a secure access code link to start your Amsterdam bike tour."
          helperText="We'll email a one-tap access link that signs you in securely."
          buttonLabel="Sign Up"
          initialError={authInlineError}
        />
      )}

      {route.path === '/tour' && !canAccessTour && page === PAGE.STOP && (
        <StopPage
          stops={STOPS}
          stop={STOPS[currentStop]}
          stopIndex={currentStop}
          onNav={goToStop}
          onHome={() => { setPage(PAGE.LANDING); window.scrollTo(0, 0); }}
          isPaid={false}
        />
      )}

      {route.path === '/tour' && !isDevBypass && authState === 'checking' && (
        <div className="auth-loading">
          <p className="auth-loading-text">Checking your access...</p>
        </div>
      )}

      {route.path === '/tour' && canAccessTour && contentState.status === 'loading' && (
        <div className="auth-loading">
          <p className="auth-loading-text">Loading your tour...</p>
        </div>
      )}

      {route.path === '/tour' && canAccessTour && contentState.status === 'error' && (
        <div className="login-page">
          <div className="landing-hero login-hero page-header">
            <h1>Tour Unavailable</h1>
            <p className="login-subtitle">We couldn&apos;t load your tour content right now.</p>
          </div>
          <div className="login-card">
            <p className="login-error">{contentState.error}</p>
            <button
              className="login-btn"
              type="button"
              onClick={() => {
                setContentState({ status: 'idle', error: '' });
                setContentReloadCount((count) => count + 1);
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {isTourReady && page === PAGE.LANDING && (
        <LandingPage
          faq={faq}
          onViewAll={goToAllStops}
          onStopByStop={() => goToStop(0)}
          onFindNearestStart={goToNearestStart}
        />
      )}

      {route.path === '/tour' && page === PAGE.ALL_STOPS && (
        <AllStopsPage
          stops={isTourReady ? stops : STOPS}
          onSelectStop={goToStop}
          onHome={() => { setPage(PAGE.LANDING); window.scrollTo(0, 0); }}
        />
      )}

      {isTourReady && page === PAGE.STOP && (
        <StopPage
          stops={stops}
          stop={stops[currentStop]}
          stopIndex={currentStop}
          onNav={goToStop}
          onHome={() => { setPage(PAGE.LANDING); window.scrollTo(0, 0); }}
          isPaid={true}
        />
      )}

      <a
        className="floating-feedback-btn"
        href={feedbackLink}
        aria-label="Help us improve"
      >
        Help Us Improve
      </a>

      {isAuthenticated && (
        <button className="floating-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      )}

      {showWelcomeModal && (
        <div className="welcome-modal-backdrop" role="presentation">
          <div
            className="welcome-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-modal-title"
          >
            <div className="welcome-modal-tick" aria-hidden="true">✓</div>
            <h2 id="welcome-modal-title">Thanks for your purchase</h2>
            <p>You can now start the tour.</p>
            <button
              type="button"
              className="login-btn welcome-modal-btn"
              onClick={() => setShowWelcomeModal(false)}
            >
              Start Tour
            </button>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>{copyrightLabel}</p>
        <p className="app-footer-love">Made with love in the Netherlands 🇳🇱</p>
      </footer>
    </div>
  );
}
