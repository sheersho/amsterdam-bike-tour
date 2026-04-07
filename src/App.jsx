import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { STOPS } from './data/tourdata';

import LandingPage from './components/LandingPage';
import AllStopsPage from './components/AllStopsPage';
import StopPage from './components/StopPage';
import LoginPage from './components/LoginPage';

function clearAuthStorage() {
  localStorage.removeItem('tour-email');
  localStorage.removeItem('tour-token');
  localStorage.removeItem('tour-auth-expiry');
}

const SESSION_TTL_MS = 48 * 60 * 60 * 1000;

function hasValidSession() {
  const email = localStorage.getItem('tour-email');
  const expiryAt = Number(localStorage.getItem('tour-auth-expiry') || 0);
  const valid = email === 'pim' && expiryAt > Date.now();
  if (!valid) clearAuthStorage();
  return valid;
}

export default function App() {
  // pages: "login" | "landing" | "allStops" | "stop"
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasValidSession());
  const [pendingRoute, setPendingRoute] = useState(null);
  const [page, setPage] = useState("landing");
  const [currentStop, setCurrentStop] = useState(0);
  const feedbackLink = "https://forms.gle/2xmXFyHcSLPrvoBJA";

  const goToStop = (i) => {
    if (!isAuthenticated) {
      setPendingRoute({ page: "stop", stopIndex: i });
      setPage("login");
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
      setPage("login");
      window.scrollTo(0, 0);
      return;
    }

    setPage("allStops");
  };

  const handleLogin = async (emailId) => {
    const normalized = String(emailId || '').trim().toLowerCase();
    if (normalized !== 'pim') {
      throw new Error('Access denied. Only `pim` can log in.');
    }

    localStorage.setItem('tour-email', 'pim');
    localStorage.setItem('tour-auth-expiry', String(Date.now() + SESSION_TTL_MS));
    setIsAuthenticated(true);

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

  const handleLogout = () => {
    clearAuthStorage();
    setIsAuthenticated(false);
    setPendingRoute(null);
    setPage("landing");
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const expiryAt = Number(localStorage.getItem('tour-auth-expiry') || 0);
    const msRemaining = expiryAt - Date.now();

    if (msRemaining <= 0) {
      handleLogout();
      return;
    }

    const timeout = window.setTimeout(() => {
      handleLogout();
    }, msRemaining);

    return () => window.clearTimeout(timeout);
  }, [isAuthenticated]);

  return (
    <div className="app">
      {page === "login" && (
        <LoginPage onLogin={handleLogin} />
      )}

      {page === "landing" && (
        <LandingPage
          onViewAll={goToAllStops}
          onStopByStop={() => goToStop(0)}
        />
      )}

      {page === "allStops" && (
        <AllStopsPage
          onSelectStop={goToStop}
          onHome={() => { setPage("landing"); window.scrollTo(0, 0); }}
        />
      )}

      {page === "stop" && (
        <StopPage
          stop={STOPS[currentStop]}
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
