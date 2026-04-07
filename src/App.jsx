import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { STOPS } from './data/tourdata';

import LandingPage from './components/LandingPage';
import AllStopsPage from './components/AllStopsPage';
import StopPage from './components/StopPage';
import LoginPage from './components/LoginPage';

async function safeJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function clearAuthStorage() {
  localStorage.removeItem('tour-email');
  localStorage.removeItem('tour-token');
  localStorage.removeItem('tour-auth-expiry');
}

export default function App() {
  // pages: "login" | "landing" | "allStops" | "stop"
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
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

  const handleLogin = async (email) => {
    let response;
    try {
      response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      throw new Error('Cannot reach auth server. Start it with `npm run server`.');
    }

    const data = await safeJson(response);
    if (!response.ok || !data?.token) {
      throw new Error(data?.error || 'Unable to log in. Check auth server and try again.');
    }

    localStorage.setItem('tour-token', data.token);
    localStorage.setItem('tour-email', data.email);
    localStorage.setItem('tour-auth-expiry', String(data.expiresAt || 0));
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

    const timer = window.setTimeout(() => {
      handleLogout();
    }, msRemaining);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    const token = localStorage.getItem('tour-token');
    if (!token) {
      clearAuthStorage();
      setIsAuthenticated(false);
      setIsCheckingSession(false);
      return;
    }

    const verifySession = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Session invalid');
        const data = await safeJson(response);
        if (!data?.email) throw new Error('Invalid session payload');
        if (data.expiresAt) {
          localStorage.setItem('tour-auth-expiry', String(data.expiresAt));
        }
        if (data.email) {
          localStorage.setItem('tour-email', data.email);
        }
        setIsAuthenticated(true);
      } catch (err) {
        clearAuthStorage();
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifySession();
  }, []);

  if (isCheckingSession) {
    return (
      <div className="app auth-loading">
        <div className="auth-loading-text">Checking access...</div>
      </div>
    );
  }

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
