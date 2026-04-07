import React, { useState } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';

export default function LoginPage({ onLogin }) {
  const [emailId, setEmailId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalized = emailId.trim().toLowerCase();

    if (!normalized) {
      setError('Enter your username to continue.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onLogin(normalized);
    } catch (err) {
      setError(err.message || 'Unable to log in right now. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="landing-hero login-hero">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to access your stop-by-stop Amsterdam bike tour.</p>
      </div>

      <div className="login-card">
        <h2>Log In</h2>
        <p className="login-helper-text">Enter the approved username to access the tour.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="emailId">Username</label>
          <input
            id="emailId"
            type="text"
            autoComplete="username"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="login-input"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Signing In...' : 'Access My Tour'}
          </button>
        </form>
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
