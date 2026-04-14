import React, { useEffect } from 'react';
import { mapsNavUrl, FREE_STOP_COUNT } from '../../data/rideRoutes';
import { updateSessionStop } from '../../lib/rideApi';
import { TOUR_PRICE_DISPLAY } from '../../lib/rideApi';

export default function RideStopPage({
  stop,
  nextStop,
  routeIndex,
  routeLength,
  session,
  paymentsEnabled = true,
  onContinue,
  onPaywall,
}) {
  // When payments are disabled by staff, treat every user as paid
  const isPaid = session?.is_paid || !paymentsEnabled;
  // Index 0 always free. Index 1: full content shown but paywall blocks continuation.
  // Index 2+: full content only if paid, otherwise paywall gate.
  const showNarrative = routeIndex <= 1 || isPaid;
  const isLastStop = routeIndex === routeLength - 1;

  // Show paywall section instead of Continue when user is unpaid and past first free stop
  const showPaywallSection = routeIndex >= (FREE_STOP_COUNT - 1) && !isPaid;
  // Stop index 0: entry point, no paywall ever
  const showContinue = routeIndex === 0 || isPaid;

  // Sync current stop to backend (fire-and-forget)
  useEffect(() => {
    if (!session?.session_id) return;
    const url = window.location.pathname;
    updateSessionStop(session.session_id, {
      currentStopId: stop.id,
      lastContentUrl: url,
    }).catch(() => {}); // non-critical
  }, [stop.id, session?.session_id]);

  // Paragraphs from narrative text
  const paragraphs = (stop.narrative || '').split(/\n\n+/).filter(Boolean);

  return (
    <div className="ride-page ride-stop-page">
      {/* Sticky header */}
      <div className="ride-stop-header">
        <span className="ride-stop-progress">
          {routeIndex + 1} / {routeLength}
        </span>
        <span className="ride-stop-name-label">{stop.name}</span>
        <span className="ride-stop-progress-spacer" />
      </div>

      {/* Hero image */}
      <div className="ride-stop-hero">
        {stop.image ? (
          <img
            className="ride-stop-hero-img"
            src={stop.image}
            alt={stop.name}
            loading="lazy"
          />
        ) : (
          <div className="ride-stop-hero-placeholder" />
        )}
        <div className="ride-stop-hero-overlay">
          <h1 className="ride-stop-hero-title">{stop.name}</h1>
        </div>
      </div>

      {/* Narrative */}
      <div className="ride-stop-content">
        {showNarrative ? (
          <div className="ride-stop-narrative">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          // Teaser for locked stops 2+ when unpaid (shouldn't normally be reached via normal flow)
          <div className="ride-stop-locked-teaser">
            <p>Unlock the full tour to continue reading.</p>
          </div>
        )}

        {/* Bottom action section */}
        <div className="ride-stop-actions">
          {showPaywallSection && (
            <div className="ride-paywall-section">
              <div className="ride-paywall-hook">
                <p className="ride-paywall-label">Want to keep going?</p>
                <p className="ride-paywall-desc">
                  Unlock all {routeLength - FREE_STOP_COUNT} remaining stops with full
                  narratives and turn-by-turn routes.
                </p>
                <div className="ride-paywall-price">{TOUR_PRICE_DISPLAY}</div>
              </div>
              <button
                className="ride-btn ride-btn-primary ride-paywall-cta"
                onClick={onPaywall}
              >
                Unlock full tour
              </button>
            </div>
          )}

          {showContinue && !isLastStop && nextStop && (
            <div className="ride-next-section">
              <div className="ride-next-label">Next stop</div>
              <div className="ride-next-name">{nextStop.name}</div>
              <div className="ride-next-actions">
                <a
                  className="ride-btn ride-btn-maps"
                  href={mapsNavUrl(nextStop.lat, nextStop.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps ↗
                </a>
                <button className="ride-btn ride-btn-primary" onClick={onContinue}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {showContinue && isLastStop && (
            <div className="ride-tour-complete">
              <div className="ride-complete-icon">🎉</div>
              <h2>Tour complete!</h2>
              <p>You&apos;ve ridden all {routeLength} stops of Amsterdam.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
