import React, { useEffect, useMemo, useRef, useState } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceInKm(from, to) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a = (
    Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(toRadians(from.lat))
    * Math.cos(toRadians(to.lat))
    * Math.sin(dLng / 2)
    * Math.sin(dLng / 2)
  );

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildGoogleMapsUrl(origin, destination) {
  const params = new URLSearchParams({
    api: '1',
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    travelmode: 'bicycling',
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export default function NearestStopPage({ stops, onBack }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [nearestStop, setNearestStop] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [mapsUrl, setMapsUrl] = useState('');
  const redirectTimeoutRef = useRef(null);

  const candidateStops = useMemo(
    () => stops.filter((stop) => ['Central Station', 'Anne Frank House', 'Skinny Bridge'].includes(stop.name)),
    [stops],
  );

  useEffect(() => (
    () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    }
  ), []);

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Location is not available on this device. Please open Google Maps manually.');
      return;
    }

    setStatus('locating');
    setError('');
    setNearestStop(null);
    setDistanceKm(null);
    setMapsUrl('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const rankedStops = candidateStops
          .map((stop) => ({
            ...stop,
            distanceKm: distanceInKm(origin, stop),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm);

        const closest = rankedStops[0];

        if (!closest) {
          setStatus('error');
          setError('We could not find a nearby stop right now.');
          return;
        }

        const url = buildGoogleMapsUrl(origin, closest);
        setNearestStop(closest);
        setDistanceKm(closest.distanceKm);
        setMapsUrl(url);
        setStatus('ready');

        redirectTimeoutRef.current = window.setTimeout(() => {
          window.location.href = url;
        }, 1200);
      },
      (geoError) => {
        setStatus('error');
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError('Please allow location access so we can suggest the nearest stop.');
          return;
        }

        setError('We could not read your location right now. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="login-page nearest-stop-page">
      <div className="landing-hero login-hero nearest-stop-hero">
        <h1>Find Your Best Starting Point</h1>
        <p className="login-subtitle">
          We&apos;ll compare your location with Central Station, Anne Frank House, and Skinny Bridge,
          then open the quickest bike route in Google Maps.
        </p>
      </div>

      <div className="login-card nearest-stop-card">
        <h2>Start Near Me</h2>
        <p className="login-helper-text">
          Tap the button below to use your current location and get routed to the nearest of the three suggested stops.
        </p>

        <button
          type="button"
          className="login-btn"
          onClick={handleFindNearest}
          disabled={status === 'locating'}
        >
          {status === 'locating' ? 'Finding Your Location...' : 'Use My Current Location'}
        </button>

        {error && <p className="login-error">{error}</p>}

        {nearestStop && (
          <div className="nearest-stop-result">
            <p className="nearest-stop-kicker">Suggested stop</p>
            <h3>{nearestStop.name}</h3>
            <p className="nearest-stop-meta">
              About {distanceKm.toFixed(1)} km away. Opening Google Maps now.
            </p>
            <a className="magic-link-preview nearest-stop-link" href={mapsUrl}>
              Open Google Maps now
            </a>
          </div>
        )}

        <button type="button" className="cta-btn cta-btn-outline nearest-stop-back" onClick={onBack}>
          Back To Home
        </button>
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
