import React, { useState, useRef, useEffect } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';
import { HERO_EMOJI } from '../data/tourdata';

const UPCOMING_TOURS = [
  { name: 'Amsterdam West',  emoji: '🌿', bgClass: 'tour-promo-img-west'  },
  { name: 'Amsterdam East',  emoji: '⚓', bgClass: 'tour-promo-img-east'  },
  { name: 'Amsterdam North', emoji: '🏗️', bgClass: 'tour-promo-img-north' },
  { name: 'Amsterdam South', emoji: '🎭', bgClass: 'tour-promo-img-south' },
];

export default function StopPage({ stop, stopIndex, stops, onNav, onHome }) {
  const [showMap, setShowMap] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioLoadError, setAudioLoadError] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const topRef = useRef(null);
  const audioSrc = stop.audio || `/audio/stops/stop-${stop.id}.mp3`;
  const nextStop = stopIndex < stops.length - 1 ? stops[stopIndex + 1] : null;
  const mapEmbedSrc = nextStop
    ? `https://www.google.com/maps?saddr=${stop.lat},${stop.lng}&daddr=${nextStop.lat},${nextStop.lng}&dirflg=b&output=embed`
    : `https://www.google.com/maps?q=${stop.lat},${stop.lng}&z=16&output=embed`;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAudioModalOpen(false);
    setAudioLoadError(false);
  }, [stopIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsAudioModalOpen(false);
    };

    if (isAudioModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isAudioModalOpen]);

  return (
    <div>
      <div ref={topRef} />

      {/* Top navigation bar */}
      <div className="stop-top-nav">
        <div className="stop-top-nav-left">
          <button className="stop-top-nav-btn stop-top-nav-btn-home" onClick={onHome} aria-label="Home">
            «
          </button>
          <button
            className="stop-top-nav-btn"
            onClick={() => onNav(stopIndex - 1)}
            disabled={stopIndex === 0}
            aria-label="Previous stop"
          >
            ‹
          </button>
        </div>
        <span className="stop-top-nav-title">{stop.name}</span>
        <button
          className="stop-top-nav-btn"
          onClick={() => onNav(stopIndex + 1)}
          disabled={stopIndex >= stops.length - 1}
          aria-label="Next stop"
        >
          ›
        </button>
      </div>

      {/* Hero */}
      <div className="stop-hero">
        {stop.image ? (
          <img src={stop.image} alt={stop.name} className="stop-hero-image" />
        ) : (
          <div className={`stop-hero-placeholder stop-hero-gradient-${stopIndex + 1}`}>
            {HERO_EMOJI[stopIndex]}
          </div>
        )}
        <div className="stop-hero-overlay" />
      </div>

      {/* Toggle bar */}
      <div className="toggle-bar">
        <button
          className={`toggle-btn ${isAudioModalOpen ? "active" : ""}`}
          onClick={() => {
            setShowMap(false);
            setAudioLoadError(false);
            setIsAudioModalOpen(true);
          }}
        >
          🎧 Audio
        </button>
        <button
          className={`toggle-btn ${showMap ? "active" : ""}`}
          onClick={() => {
            setIsAudioModalOpen(false);
            setShowMap(true);
          }}
        >
          📍 View Map
        </button>
      </div>

      {/* Stops Nav */}
      <div className="stops-nav">
        <h3>Bike Stops</h3>
        <div className="stops-grid">
          {stops.map((s, i) => (
            <div
              key={s.id}
              className={`stops-grid-item ${i === stopIndex ? "current" : ""}`}
              onClick={() => onNav(i)}
            >
              <span className="num">{i + 1}.</span>
              <span className="sname">{s.name}</span>
              {i === stopIndex && (
                <span className="current-tooltip current-tooltip-tick" role="status" aria-label="Current stop">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Narrative or Map */}
      {showMap ? (
        <iframe
          className="map-embed"
          src={mapEmbedSrc}
          loading="lazy"
          allowFullScreen
          title={nextStop ? `${stop.name} to ${nextStop.name}` : stop.name}
        />
      ) : (
        <div className="narrative-section">
          <div className="narrative-text">{stop.narrative}</div>
        </div>
      )}

      {/* Map always below narrative when not toggled */}
      {!showMap && (
        <iframe
          className="map-embed map-embed-spaced"
          src={mapEmbedSrc}
          loading="lazy"
          allowFullScreen
          title={nextStop ? `${stop.name} to ${nextStop.name}` : stop.name}
        />
      )}

      {/* Other Tours */}
      <div className="other-tours">
        <h3>Self-guided bike tours</h3>
        {UPCOMING_TOURS.map((t) => (
          <div key={t.name} className="tour-promo-card">
            <div className={`tour-promo-img ${t.bgClass}`}>{t.emoji}</div>
            <div className="tour-promo-info">
              <h4>{t.name}</h4>
              <p>Coming Soon</p>
            </div>
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <div className={`next-btn-container ${stopIndex === 0 ? "first-stop" : ""}`}>
        {stopIndex > 0 && (
          <button className="prev-btn" onClick={() => onNav(stopIndex - 1)}>
            ← Previous
          </button>
        )}
        {stopIndex < stops.length - 1 ? (
          <button className="next-btn" onClick={() => onNav(stopIndex + 1)}>
            Next Location →
          </button>
        ) : (
          <button className="next-btn" onClick={onHome}>
            ✓ Finish Tour
          </button>
        )}
      </div>

      <AmsterdamSkyline />

      {isAudioModalOpen && (
        <div
          className="audio-modal-backdrop"
          role="presentation"
          onClick={() => setIsAudioModalOpen(false)}
        >
          <div
            className="audio-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audio-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="audio-modal-close"
              aria-label="Close audio player"
              onClick={() => setIsAudioModalOpen(false)}
            >
              ✕
            </button>
            <p className="audio-modal-kicker">Stop {stop.id}</p>
            <h3 id="audio-modal-title">{stop.name}</h3>
            <p className="audio-modal-subtitle">Audio narration</p>
            <audio
              key={audioSrc}
              className="audio-modal-player"
              controls
              preload="none"
              autoPlay
              onError={() => setAudioLoadError(true)}
            >
              <source src={audioSrc} type="audio/mpeg" />
              Your browser does not support audio playback.
            </audio>
            {audioLoadError && (
              <p className="audio-modal-error">
                Audio file not found for this stop yet. Add an MP3 at <code>{audioSrc}</code>.
              </p>
            )}
          </div>
        </div>
      )}

      {showBackToTop && (
        <button className="back-to-top" onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}>
          ↑
        </button>
      )}
    </div>
  );
}
