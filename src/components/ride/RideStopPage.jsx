import React, { useEffect } from 'react';
import { mapsNavUrl, FREE_STOP_COUNT } from '../../data/rideRoutes';
import { updateSessionStop } from '../../lib/rideApi';
import { TOUR_PRICE_DISPLAY } from '../../lib/rideApi';

export default function RideStopPage({
  stop,
  nextStop,
  route = [],
  routeIndex,
  routeLength,
  session,
  paymentsEnabled = true,
  onContinue,
  onPaywall,
  onHome,
  onPrevStop,
  onNextStop,
  onSelectStop,
  canGoPrev = true,
  canGoNext = true,
}) {
  // When payments are disabled by staff, treat every user as paid
  const hasPaidAccess = session?.is_paid === true;
  const isPaid = hasPaidAccess || !paymentsEnabled;
  // Maps are locked for free users while payments are enabled.
  const canUseMaps = !paymentsEnabled || hasPaidAccess;
  const maxVisibleStopsForFree = 3;
  const shouldLimitStopsGrid = paymentsEnabled && !hasPaidAccess;
  const lockedStopsCount = Math.max(0, routeLength - maxVisibleStopsForFree);
  // Index 0 always free. Index 1: full content shown but paywall blocks continuation.
  // Index 2+: full content only if paid, otherwise paywall gate.
  const showNarrative = routeIndex <= 1 || isPaid;
  const isLastStop = routeIndex === routeLength - 1;
  const mapEmbedSrc = nextStop
    ? `https://www.google.com/maps?saddr=${stop.lat},${stop.lng}&daddr=${nextStop.lat},${nextStop.lng}&dirflg=b&output=embed`
    : `https://www.google.com/maps?q=${stop.lat},${stop.lng}&z=16&output=embed`;

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
        <div className="ride-stop-header-left">
          <button
            type="button"
            className="ride-stop-header-btn ride-stop-header-home-btn"
            onClick={onHome}
            aria-label="Home"
          >
            «
          </button>
          <button
            type="button"
            className="ride-stop-header-btn"
            onClick={onPrevStop}
            disabled={!canGoPrev}
            aria-label="Previous stop"
          >
            ‹
          </button>
        </div>
        <span className="ride-stop-name-label">{stop.name}</span>
        <button
          type="button"
          className="ride-stop-header-btn"
          onClick={onNextStop}
          disabled={!canGoNext}
          aria-label="Next stop"
        >
          ›
        </button>
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

      {/* Stops card (always visible) */}
      <div className={`stops-nav ${shouldLimitStopsGrid ? 'stops-nav-locked' : ''}`}>
        <h3>Bike Stops</h3>
        <div className="stops-grid">
          {route.map((routeStop, idx) => {
              const isLocked = shouldLimitStopsGrid && idx >= maxVisibleStopsForFree;
              const isCurrent = idx === routeIndex;
              const fadeStep = Math.max(0, idx - maxVisibleStopsForFree);
              const lockedOpacity = Math.max(0.22, 0.64 - (fadeStep * 0.09));
              return (
                <React.Fragment key={routeStop.id}>
                  <button
                    type="button"
                    className={`stops-grid-item ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                    onClick={() => {
                      if (isLocked) return;
                      onSelectStop?.(idx);
                    }}
                    aria-label={isLocked ? `Locked stop ${idx + 1}` : `Go to stop ${idx + 1}: ${routeStop.name}`}
                    style={isLocked ? { opacity: lockedOpacity } : undefined}
                  >
                    <span className="num">{idx + 1}.</span>
                    <span className="sname">{isLocked ? 'Locked stop' : routeStop.name}</span>
                    {isLocked && (
                      <span className="stops-lock-badge" aria-hidden="true">🔒</span>
                    )}
                    {isCurrent && !isLocked && (
                      <span className="current-tooltip current-tooltip-tick" role="status" aria-label="Current stop">
                        ✓
                      </span>
                    )}
                  </button>

                  {shouldLimitStopsGrid && idx === maxVisibleStopsForFree - 1 && (
                    <div className="stops-grid-inline-paywall">
                      <button
                        type="button"
                        className="stops-grid-unlock-cta"
                        onClick={onPaywall}
                        aria-label={`Unlock ${lockedStopsCount} more stops for ${TOUR_PRICE_DISPLAY}`}
                      >
                        Unlock {lockedStopsCount} more stops for {TOUR_PRICE_DISPLAY}
                      </button>
                      <p className="stops-grid-unlock-subtext">
                        Fast checkout. Apple Pay / Google Pay when available.
                      </p>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
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

        {canUseMaps && (
          <div className="ride-stop-map-wrap">
            <div className="ride-stop-map-title">
              {nextStop ? `Route to ${nextStop.name}` : 'Stop location'}
            </div>
            <iframe
              className="ride-stop-map-embed"
              src={mapEmbedSrc}
              loading="lazy"
              allowFullScreen
              title={nextStop ? `${stop.name} to ${nextStop.name}` : stop.name}
            />
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
                {canUseMaps && (
                  <a
                    className="ride-btn ride-btn-maps"
                    href={mapsNavUrl(nextStop.lat, nextStop.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Maps ↗
                  </a>
                )}
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
