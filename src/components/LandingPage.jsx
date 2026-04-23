import React from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';
import { cityCenterImages } from '../data/images';

export default function LandingPage({ faq, onViewAll, onStopByStop, onFindNearestStart }) {
  return (
    <div>
      <div className="landing-hero page-header">
        <h1>Bill's Bike Tour</h1>
        <p className="landing-subtitle">Amsterdam</p>
      </div>

      <div className="route-card" onClick={onViewAll} style={{ cursor: 'pointer' }}>
        <div className="route-card-media">
           <div className="route-card-img-placeholder">
            <img
              src={cityCenterImages[0]}
              alt="Amsterdam city center aerial view"
              className="route-card-image"
              loading="lazy"
            />
          </div>
          <div className="route-card-overlay">
            <div className="route-card-label">City Center</div>
            <div className="route-card-meta">
              <span>🕐</span> 14 KM | 10 Stops
            </div>
          </div>
        </div>
      </div>

      <div className="choose-section">
        <button className="cta-btn cta-btn-filled cta-btn-full" onClick={onStopByStop}>Start the Tour</button>
      </div>

      <div className="reassurance">
        You can always comeback here. There's no wrong way to do this.
      </div>

      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        {faq.map((item, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q">{i + 1}. {item.q}</div>
            <div className="faq-a">
              {Array.isArray(item.a) ? (
                <ul>{item.a.map((li, j) => <li key={j}>{li}</li>)}</ul>
              ) : (
                <p>{item.a}</p>
              )}
              {item.note && <div className="faq-note">{item.note}</div>}
            </div>
          </div>
        ))}
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
