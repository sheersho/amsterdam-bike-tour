import React, { useState } from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError('Enter a valid email address to continue.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onLogin(normalizedEmail);
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
        <p className="login-helper-text">Use the same approved email you used when booking.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            placeholder="you@example.com"
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
