import React, { useState } from 'react';
import './styles/App.css';
import { STOPS } from './data/tourdata';

import LandingPage from './components/LandingPage';
import AllStopsPage from './components/AllStopsPage';
import StopPage from './components/StopPage';

export default function App() {
  // pages: "landing" | "allStops" | "stop"
  const [page, setPage] = useState("landing");
  const [currentStop, setCurrentStop] = useState(0);
  const feedbackLink = "https://forms.gle/2xmXFyHcSLPrvoBJA";

  const goToStop = (i) => {
    setCurrentStop(i);
    setPage("stop");
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      {page === "landing" && (
        <LandingPage
          onViewAll={() => setPage("allStops")}
          onStopByStop={() => goToStop(0)}
        />
      )}

      {page === "allStops" && (
        <AllStopsPage
          onSelectStop={goToStop}
          onHome={() => { setPage("landing"); window.scrollTo(0, 0); }}
        />
      )}

      {page === "stop" && (
        <StopPage
          stop={STOPS[currentStop]}
          stopIndex={currentStop}
          onNav={goToStop}
          onHome={() => { setPage("landing"); window.scrollTo(0, 0); }}
        />
      )}

      <a
        className="floating-feedback-btn"
        href={feedbackLink}
        aria-label="Help us improve"
      >
        Help Us Improve
      </a>
    </div>
  );
}
