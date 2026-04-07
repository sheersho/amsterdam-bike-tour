import React, { useState, useRef, useEffect } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';
import { STOPS, HERO_EMOJI } from '../data/tourdata';

export default function StopPage({ stop, stopIndex, onNav, onHome }) {
  const [showMap, setShowMap] = useState(false);
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stopIndex]);

  return (
    <div>
      <div ref={topRef} />

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
        <button className={`toggle-btn ${!showMap ? "active" : ""}`} onClick={() => setShowMap(false)}>
          🎧 Audio
        </button>
        <button className={`toggle-btn ${showMap ? "active" : ""}`} onClick={() => setShowMap(true)}>
          📍 View Map
        </button>
      </div>

      {/* Stops Nav */}
      <div className="stops-nav">
        <h3>Bike Stops</h3>
        <div className="stops-grid">
          {STOPS.map((s, i) => (
            <div
              key={s.id}
              className={`stops-grid-item ${i === stopIndex ? "current" : ""}`}
              onClick={() => onNav(i)}
            >
              <span className="num">{i + 1}.</span>
              <span className="sname">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative or Map */}
      {showMap ? (
        <iframe
          className="map-embed"
          src={`https://www.google.com/maps?q=${stop.lat},${stop.lng}&z=16&output=embed`}
          loading="lazy"
          allowFullScreen
          title={stop.name}
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
          src={`https://www.google.com/maps?q=${stop.lat},${stop.lng}&z=16&output=embed`}
          loading="lazy"
          allowFullScreen
          title={stop.name}
        />
      )}

      {/* Other Tours */}
      <div className="other-tours">
        <h3>Self-guided bike tours</h3>
        {[
          { name: "Amsterdam West", emoji: "🌿", bgClass: "tour-promo-img-west" },
          { name: "Amsterdam East", emoji: "⚓", bgClass: "tour-promo-img-east" },
          { name: "Amsterdam North", emoji: "🏗️", bgClass: "tour-promo-img-north" },
          { name: "Amsterdam South", emoji: "🎭", bgClass: "tour-promo-img-south" },
        ].map((t) => (
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
        {stopIndex < STOPS.length - 1 ? (
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

      <button className="back-to-top" onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}>
        ↑
      </button>
    </div>
  );
}
