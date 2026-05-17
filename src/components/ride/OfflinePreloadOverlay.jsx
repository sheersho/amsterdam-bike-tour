import React, { useEffect, useState, useRef } from 'react';
import { triggerOfflinePreload } from '../../lib/offlineCache';

/**
 * Full-screen overlay shown once per session to preload map tiles and audio.
 * Calls onDone() when preloading finishes or the user taps Skip.
 */
export default function OfflinePreloadOverlay({ onDone }) {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState('starting'); // 'starting' | 'loading' | 'done'
  const doneRef = useRef(false);

  useEffect(() => {
    setPhase('loading');

    triggerOfflinePreload((p) => {
      setPct(p);
      if (p >= 100 && !doneRef.current) {
        doneRef.current = true;
        setPhase('done');
        // Short pause so user sees 100% before auto-advancing
        setTimeout(onDone, 800);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSkip() {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }

  return (
    <div className="preload-overlay">
      <div className="preload-card">
        <div className="preload-icon">{phase === 'done' ? '✅' : '🗺️'}</div>

        <h2 className="preload-title">
          {phase === 'done' ? 'Ready for offline use' : 'Preparing offline maps'}
        </h2>

        <p className="preload-subtitle">
          {phase === 'done'
            ? 'Maps and audio are saved. You can navigate with weak signal.'
            : 'Saving maps and audio so you can navigate without signal.'}
        </p>

        {/* Progress bar */}
        <div className="preload-bar-track">
          <div
            className="preload-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="preload-pct">{pct}%</div>

        {phase !== 'done' && (
          <button className="preload-skip" onClick={handleSkip}>
            Skip — use online maps
          </button>
        )}
      </div>
    </div>
  );
}
