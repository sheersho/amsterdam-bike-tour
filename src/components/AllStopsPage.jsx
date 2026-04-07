import React, { useRef } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';
import { STOPS, HERO_COLORS, HERO_EMOJI } from '../data/tourdata';

export default function AllStopsPage({ onSelectStop, onHome }) {
  const topRef = useRef(null);
  return (
    <div>
      <div ref={topRef} />
      <div className="landing-hero" style={{ paddingBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={onHome} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: 0 }}>←</button>
          <h1 style={{ fontSize: 22 }}>All Stops</h1>
        </div>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Tap any stop to explore</p>
      </div>

      <div style={{ padding: "16px" }}>
        {STOPS.map((stop, i) => (
          <div
            key={stop.id}
            onClick={() => onSelectStop(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 12px",
              marginBottom: 8,
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              cursor: "pointer",
              border: "1px solid #eee",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <div style={{
              width: 44, height: 44,
              borderRadius: 10,
              background: stop.image ? `url(${stop.image}) center/cover no-repeat` : HERO_COLORS[i],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>
              {!stop.image && HERO_EMOJI[i]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
                {i + 1}. {stop.name}
              </div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                Tap to read & explore
              </div>
            </div>
            <span style={{ color: "#8b1a2b", fontSize: 18, fontWeight: 700 }}>›</span>
          </div>
        ))}
      </div>

      <AmsterdamSkyline />
    </div>
  );
}