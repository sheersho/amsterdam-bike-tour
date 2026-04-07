import React from 'react';

// MUST HAVE 'default' HERE
export default function AmsterdamSkyline() {
  const heights = [35,50,28,60,42,55,30,65,38,48,56,32,58,44,52,36,62,40,54,46,34,58,42,50,38,60,44,48,36,55,30,52,46,64,40,56,34,48,58,42];
  return (
    <div className="skyline-footer">
      <div className="skyline-row">
        {heights.map((h, i) => (
          <div key={i} className="building" style={{ height: h, opacity: 0.7 + Math.random() * 0.3 }} />
        ))}
      </div>
    </div>
  );
}