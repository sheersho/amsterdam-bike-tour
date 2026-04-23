import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [openSectionKey, setOpenSectionKey] = useState('introduction');
  const audioRef = useRef(null);

  const hasPaidAccess = session?.is_paid === true;
  const isPaid = hasPaidAccess || !paymentsEnabled;
  const maxVisibleStopsForFree = 3;
  const shouldLimitStopsGrid = paymentsEnabled && !hasPaidAccess;
  const lockedStopsCount = Math.max(0, routeLength - maxVisibleStopsForFree);
  const showContent = routeIndex <= 1 || isPaid;
  const isLastStop = routeIndex === routeLength - 1;
  const showPaywallSection = routeIndex >= (FREE_STOP_COUNT - 1) && !isPaid;
  const showContinue = routeIndex === 0 || isPaid;

  const sections = stop.sections || [];

  // Split route into two columns: first 5 left, last 5 right
  const leftStops = route.slice(0, 5);
  const rightStops = route.slice(5, 10);

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }

  const playSection = useCallback((sectionIdx) => {
    stopAudio();
    const audio = new Audio(`/audio/stops/stop-${stop.id}-${sectionIdx + 1}.mp3`);
    audio.play().catch(() => {});
    audioRef.current = audio;
  }, [stop.id]);

  function toggleSection(key) {
    if (openSectionKey === key) {
      setOpenSectionKey(null);
      stopAudio();
    } else {
      const idx = sections.findIndex(s => s.key === key);
      setOpenSectionKey(key);
      if (idx !== -1) playSection(idx);
    }
  }

  // Stop audio on stop change or unmount; auto-open and autoplay Introduction
  useEffect(() => {
    setOpenSectionKey('introduction');
    stopAudio();
    const introIdx = sections.findIndex(s => s.key === 'introduction');
    if (introIdx !== -1) playSection(introIdx);
  }, [stop.id]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // Sync current stop to backend (fire-and-forget)
  useEffect(() => {
    if (!session?.session_id) return;
    const url = window.location.pathname;
    updateSessionStop(session.session_id, {
      currentStopId: stop.id,
      lastContentUrl: url,
    }).catch(() => {});
  }, [stop.id, session?.session_id]);

  function handleMapsClick() {
    stopAudio();
    setOpenSectionKey(null);
  }

  const mapsHref = stop.routeMapsUrl || (nextStop
    ? mapsNavUrl(nextStop.lat, nextStop.lng)
    : mapsNavUrl(stop.lat, stop.lng));

  function renderStopButton(routeStop, idx) {
    const isLocked = shouldLimitStopsGrid && idx >= maxVisibleStopsForFree;
    const isCurrent = idx === routeIndex;
    const fadeStep = Math.max(0, idx - maxVisibleStopsForFree);
    const lockedOpacity = Math.max(0.22, 0.64 - (fadeStep * 0.09));
    return (
      <button
        key={routeStop.id}
        type="button"
        className={`stops-grid-item ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
        onClick={() => { if (!isLocked) onSelectStop?.(idx); }}
        aria-label={isLocked ? `Locked stop ${idx + 1}` : `Go to stop ${idx + 1}: ${routeStop.name}`}
        style={isLocked ? { opacity: lockedOpacity } : undefined}
      >
        <span className="num">{idx + 1}.</span>
        <span className="sname">{isLocked ? 'Locked stop' : routeStop.name}</span>
        {isLocked && <span className="stops-lock-badge" aria-hidden="true">🔒</span>}
        {isCurrent && !isLocked && (
          <span className="current-tooltip current-tooltip-tick" role="status" aria-label="Current stop">✓</span>
        )}
      </button>
    );
  }

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
          >«</button>
          <button
            type="button"
            className="ride-stop-header-btn"
            onClick={onPrevStop}
            disabled={!canGoPrev}
            aria-label="Previous stop"
          >‹</button>
        </div>
        <span className="ride-stop-name-label">{stop.name}</span>
        <button
          type="button"
          className="ride-stop-header-btn"
          onClick={onNextStop}
          disabled={!canGoNext}
          aria-label="Next stop"
        >›</button>
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
      </div>

      {/* Full-width CTA: open route to next stop */}
      <a
        className="ride-stop-maps-cta"
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleMapsClick}
        aria-label={nextStop ? `Open route to ${nextStop.name} in Maps` : 'Open location in Maps'}
      >
        📌&thinsp;·&thinsp;·&thinsp;·&thinsp;🚲&thinsp;·&thinsp;·&thinsp;·&thinsp;📍&ensp;Open route to next stop
      </a>

      {/* Accordion sections */}
      {showContent ? (
        <div className="ride-stop-sections">
          {sections.map((section, idx) => {
            const isOpen = openSectionKey === section.key;
            const paragraphs = section.text.split(/\n\n+/).filter(Boolean);
            return (
              <div key={section.key} className={`ride-section ${isOpen ? 'ride-section--open' : ''}`}>
                <button
                  type="button"
                  className="ride-section-header"
                  onClick={() => toggleSection(section.key)}
                  aria-expanded={isOpen}
                >
                  <span className="ride-section-icon">{isOpen ? '−' : '+'}</span>
                  <span className="ride-section-title">{section.title}</span>
                  <span className="ride-section-audio-ctrl" aria-hidden="true">
                    {isOpen ? (
                      <span className="ride-section-wave">
                        <span /><span /><span /><span /><span />
                      </span>
                    ) : (
                      <span className="ride-section-play-icon">▶</span>
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div className="ride-section-content">
                    {paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ride-stop-locked-teaser">
          <p>Unlock the full tour to continue reading.</p>
        </div>
      )}

      {/* Bike Stops */}
      <div className={`stops-nav ${shouldLimitStopsGrid ? 'stops-nav-locked' : ''}`}>
        <h3>Bike Stops</h3>

        <div className="stops-grid-two-col">
          {/* Left column: stops 1–5 (indices 0–4) */}
          <div className="stops-col">
            {leftStops.map((routeStop, idx) => renderStopButton(routeStop, idx))}
          </div>

          {/* Right column: stops 6–10 (indices 5–9) */}
          <div className="stops-col">
            {rightStops.map((routeStop, idx) => renderStopButton(routeStop, idx + 5))}
          </div>
        </div>

        {shouldLimitStopsGrid && (
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

        {/* Custom route image */}
        {stop.routeImage && (
          <a
            className="ride-stop-route-img-wrap"
            href={stop.routeMapsUrl || mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nextStop ? `View route to ${nextStop.name} in Maps` : 'View route in Maps'}
          >
            <img
              className="ride-stop-route-img"
              src={stop.routeImage}
              alt={nextStop ? `Route from ${stop.name} to ${nextStop.name}` : `Route from ${stop.name}`}
              loading="lazy"
            />
          </a>
        )}
      </div>

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
  );
}
