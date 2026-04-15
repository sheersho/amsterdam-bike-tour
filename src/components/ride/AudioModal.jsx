import React, { useState, useEffect, useRef, useCallback } from 'react';

const SPEEDS = [1, 1.25, 1.5, 2];

export default function AudioModal({ stop, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const utteranceRef = useRef(null);
  const text = stop.narrative || '';

  const startSpeech = useCallback((overrideSpeed) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = (overrideSpeed ?? speed) * 0.92;
    utterance.pitch = 1;
    utterance.onstart = () => { setIsPlaying(true); setIsPaused(false); };
    utterance.onend   = () => { setIsPlaying(false); setIsPaused(false); };
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, speed]);

  function handleSpeedChange(s) {
    setSpeed(s);
    if (isPlaying || isPaused) {
      startSpeech(s);
    }
  }

  const togglePause = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  function handleClose() {
    window.speechSynthesis.cancel();
    onClose();
  }

  // Auto-start when the modal opens
  useEffect(() => {
    startSpeech();
    return () => window.speechSynthesis.cancel();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="audio-modal-overlay" onClick={handleClose}>
      <div className="audio-modal" onClick={e => e.stopPropagation()}>

        <div className="audio-modal-header">
          <div className="audio-modal-icon-wrap">🎧</div>
          <div className="audio-modal-meta">
            <div className="audio-modal-title">Audio Guide</div>
            <div className="audio-modal-stop-name">{stop.name}</div>
          </div>
          <button className="audio-modal-close-btn" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        <div className="audio-modal-status">
          {isPlaying && !isPaused ? (
            <div className="audio-wave" aria-label="Playing">
              <span /><span /><span /><span /><span />
            </div>
          ) : (
            <span className="audio-modal-status-label">
              {isPaused ? 'Paused' : 'Stopped'}
            </span>
          )}
        </div>

        <div className="audio-modal-controls">
          <button className="audio-modal-btn" onClick={startSpeech}>↩ Restart</button>
          <button className="audio-modal-btn audio-modal-btn-primary" onClick={togglePause} disabled={!isPlaying && !isPaused}>
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button className="audio-modal-btn audio-modal-btn-stop" onClick={handleClose}>■ Stop</button>
        </div>

        <div className="audio-modal-speeds">
          {SPEEDS.map(s => (
            <button
              key={s}
              className={`audio-modal-speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => handleSpeedChange(s)}
            >
              {s === 1 ? '1×' : `${s}×`}
            </button>
          ))}
        </div>

        <p className="audio-modal-note">
          Your device reads this stop's full narrative aloud.
        </p>
      </div>
    </div>
  );
}
