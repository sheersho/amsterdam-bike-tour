import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { FAQ, STOPS } from './data/tourdata';

import LandingPage from './components/LandingPage';
import AllStopsPage from './components/AllStopsPage';
import StopPage from './components/StopPage';
import LoginPage from './components/LoginPage';
import AccessPage from './components/AccessPage';
import {
  fetchTourContent,
  normalizeEmail,
  requestMagicLink,
  verifyMagicToken,
} from './lib/api';

const TOUR_EMAIL_KEY = 'tour-email';
const TOUR_TOKEN_KEY = 'tour-token';
const TOUR_AUTH_EXPIRY_KEY = 'tour-auth-expiry';
const TOUR_LAST_EMAIL_KEY = 'tour-last-email';

function clearAuthStorage() {
  localStorage.removeItem(TOUR_EMAIL_KEY);
  localStorage.removeItem(TOUR_TOKEN_KEY);
  localStorage.removeItem(TOUR_AUTH_EXPIRY_KEY);
}

function saveAuthSession({ email, token, expiresAt }) {
  localStorage.setItem(TOUR_EMAIL_KEY, normalizeEmail(email));
  localStorage.setItem(TOUR_TOKEN_KEY, token);
  localStorage.setItem(TOUR_AUTH_EXPIRY_KEY, String(expiresAt));
}

function saveLastEmail(email) {
  const normalized = normalizeEmail(email);
  if (normalized) localStorage.setItem(TOUR_LAST_EMAIL_KEY, normalized);
}

function readLastEmail() {
  return localStorage.getItem(TOUR_LAST_EMAIL_KEY) || '';
}

function readAuthSession() {
  const email = localStorage.getItem(TOUR_EMAIL_KEY);
  const token = localStorage.getItem(TOUR_TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(TOUR_AUTH_EXPIRY_KEY) || 0);

  if (!email || !token || expiresAt <= Date.now()) {
    clearAuthStorage();
    return null;
  }

  return { email, token, expiresAt };
}

function getRoute() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/access') {
    return {
      path: '/access',
      token: new URLSearchParams(window.location.search).get('token') || '',
    };
  }

  if (pathname === '/tour') {
    return { path: '/tour' };
  }

  return { path: '/' };
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

function expireSession(setAuthSession, setExpiredEmail, email) {
  clearAuthStorage();
  if (email) saveLastEmail(email);
  setAuthSession(null);
  setExpiredEmail(email || readLastEmail());
}

export default function App() {
  const [route, setRoute] = useState(() => getRoute());
  const [authSession, setAuthSession] = useState(() => readAuthSession());
  const [expiredEmail, setExpiredEmail] = useState(() => readLastEmail());
  const [pendingRoute, setPendingRoute] = useState(null);
  const [page, setPage] = useState("landing");
  const [currentStop, setCurrentStop] = useState(0);
  const [tourContent, setTourContent] = useState(() => ({ stops: STOPS, faq: FAQ }));
  const [contentState, setContentState] = useState({ status: 'idle', error: '' });
  const [contentReloadCount, setContentReloadCount] = useState(0);
  const feedbackLink = "https://forms.gle/2xmXFyHcSLPrvoBJA";
  const isAuthenticated = Boolean(authSession?.token);

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoute());
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || route.path !== '/tour') return;

    let cancelled = false;

    async function loadTour() {
      try {
        setContentState({ status: 'loading', error: '' });
        const payload = await fetchTourContent(authSession.token);
        if (cancelled) return;
        setTourContent(buildTourContent(payload));
        setContentState({ status: 'ready', error: '' });
      } catch (error) {
        if (cancelled) return;
        if (error.status === 401) {
          expireSession(setAuthSession, setExpiredEmail, authSession.email);
          updateLocation('/', { replace: true });
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
  }, [authSession, contentReloadCount, isAuthenticated, route.path]);

  const goToStop = (i) => {
    if (!isAuthenticated) {
      setPendingRoute({ page: "stop", stopIndex: i });
      updateLocation('/tour');
      window.scrollTo(0, 0);
      return;
    }

    setCurrentStop(i);
    setPage("stop");
    window.scrollTo(0, 0);
  };

  const goToAllStops = () => {
    if (!isAuthenticated) {
      setPendingRoute({ page: "allStops" });
      updateLocation('/tour');
      window.scrollTo(0, 0);
      return;
    }

    setPage("allStops");
  };

  const finishAuth = ({ email, token, expiresAt }) => {
    saveAuthSession({ email, token, expiresAt });
    saveLastEmail(email);
    setAuthSession({ email: normalizeEmail(email), token, expiresAt });
    setExpiredEmail('');
    updateLocation('/tour', { replace: true });

    if (pendingRoute?.page === "stop") {
      setCurrentStop(pendingRoute.stopIndex ?? 0);
      setPage("stop");
    } else if (pendingRoute?.page === "allStops") {
      setPage("allStops");
    } else {
      setPage("landing");
    }

    setPendingRoute(null);
    window.scrollTo(0, 0);
  };

  const handleRequestAccess = async (email) => {
    const response = await requestMagicLink(email);
    saveLastEmail(email);
    setExpiredEmail(normalizeEmail(email));
    return response;
  };

  const handleVerifyAccess = async (token) => {
    const response = await verifyMagicToken(token);
    finishAuth({
      email: response.email,
      token,
      expiresAt: response.expiresAt,
    });
    return response;
  };

  const handleLogout = () => {
    clearAuthStorage();
    setAuthSession(null);
    setPendingRoute(null);
    setPage("landing");
    updateLocation('/', { replace: true });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!authSession?.expiresAt) return;

    const msRemaining = authSession.expiresAt - Date.now();

    if (msRemaining <= 0) {
      expireSession(setAuthSession, setExpiredEmail, authSession.email);
      updateLocation('/', { replace: true });
      return;
    }

    const timeout = window.setTimeout(() => {
      expireSession(setAuthSession, setExpiredEmail, authSession.email);
      updateLocation('/', { replace: true });
    }, msRemaining);

    return () => window.clearTimeout(timeout);
  }, [authSession]);

  const stops = tourContent.stops;
  const faq = tourContent.faq;

  return (
    <div className="app">
      {route.path === '/' && (
        <LandingPage
          faq={FAQ}
          onViewAll={goToAllStops}
          onStopByStop={() => goToStop(0)}
        />
      )}

      {route.path === '/access' && (
        <AccessPage
          token={route.token}
          onVerify={handleVerifyAccess}
          onResend={handleRequestAccess}
        />
      )}

      {route.path === '/tour' && !isAuthenticated && (
        <LoginPage
          onRequestAccess={handleRequestAccess}
          initialEmail={expiredEmail}
          title="Sign Up to Get Access Code"
          subtitle="Sign up with your email and we’ll send a secure access code link to start your Amsterdam bike tour."
          helperText="We’ll email a one-tap access link that signs you in securely."
          buttonLabel="Sign Up"
        />
      )}

      {route.path === '/tour' && isAuthenticated && contentState.status === 'loading' && (
        <div className="auth-loading">
          <p className="auth-loading-text">Loading your tour...</p>
        </div>
      )}

      {route.path === '/tour' && isAuthenticated && contentState.status === 'error' && (
        <div className="login-page">
          <div className="landing-hero login-hero">
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

      {route.path === '/tour' && isAuthenticated && contentState.status === 'ready' && page === "landing" && (
        <LandingPage
          faq={faq}
          onViewAll={goToAllStops}
          onStopByStop={() => goToStop(0)}
        />
      )}

      {route.path === '/tour' && isAuthenticated && contentState.status === 'ready' && page === "allStops" && (
        <AllStopsPage
          stops={stops}
          onSelectStop={goToStop}
          onHome={() => { setPage("landing"); window.scrollTo(0, 0); }}
        />
      )}

      {route.path === '/tour' && isAuthenticated && contentState.status === 'ready' && page === "stop" && (
        <StopPage
          stops={stops}
          stop={stops[currentStop]}
          stopIndex={currentStop}
          onNav={goToStop}
          onHome={() => { setPage("landing"); window.scrollTo(0, 0); }}
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
    </div>
  );
}
