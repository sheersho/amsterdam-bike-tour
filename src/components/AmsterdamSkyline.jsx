import React from 'react';

// MUST HAVE 'default' HERE
export default function AmsterdamSkyline() {
  const buildingCount = 40;
  return (
    <div className="skyline-footer">
      <div className="skyline-row">
        {Array.from({ length: buildingCount }, (_, i) => (
          <div key={i} className="building" />
        ))}
      </div>
    </div>
  );
}
