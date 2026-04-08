import React, { useRef } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';
import { HERO_EMOJI } from '../data/tourdata';

export default function AllStopsPage({ stops, onSelectStop, onHome }) {
  const topRef = useRef(null);
  return (
    <div>
      <div ref={topRef} />
      <div className="landing-hero all-stops-hero page-header">
        <div className="all-stops-header">
          <button className="all-stops-back-btn" onClick={onHome}>←</button>
          <h1 className="all-stops-title">All Stops</h1>
        </div>
        <p className="all-stops-subtitle">Tap any stop to explore</p>
      </div>

      <div className="all-stops-list">
        {stops.map((stop, i) => (
          <div
            key={stop.id}
            onClick={() => onSelectStop(i)}
            className="all-stops-card"
          >
            <div className={`all-stops-thumb ${!stop.image ? `all-stops-thumb-color-${i + 1}` : ''}`}>
              {stop.image ? (
                <img
                  className="all-stops-thumb-image"
                  src={stop.image}
                  alt={stop.name}
                  loading="lazy"
                />
              ) : (
                HERO_EMOJI[i]
              )}
            </div>
            <div className="all-stops-card-content">
              <div className="all-stops-card-title">
                {i + 1}. {stop.name}
              </div>
              <div className="all-stops-card-subtitle">
                Tap to read & explore
              </div>
            </div>
            <span className="all-stops-card-chevron">›</span>
          </div>
        ))}
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
