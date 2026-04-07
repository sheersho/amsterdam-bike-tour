import React from 'react';
import AmsterdamSkyline from './AmsterdamSkyline';

export default function BuyNewTourPage({
  purchaseUrl,
  onGoHome,
  supportEmail = 'info@toursandtravels.amsterdam',
}) {
  return (
    <div className="login-page buy-tour-page">
      <div className="landing-hero login-hero buy-tour-hero">
        <h1>Session Expired</h1>
        <p className="login-subtitle">
          Your previous Amsterdam bike tour session has ended and can&apos;t be reactivated.
        </p>
      </div>

      <div className="login-card buy-tour-card">
        <h2>Buy A New Tour</h2>
        <p className="login-helper-text">
          To keep exploring, please purchase a new tour and use the same email address at checkout.
        </p>

        <div className="buy-tour-actions">
          <a
            className="login-btn buy-tour-primary"
            href={purchaseUrl}
            target="_blank"
            rel="noreferrer"
          >
            Buy New Tour
          </a>
          <button className="cta-btn cta-btn-outline buy-tour-secondary" type="button" onClick={onGoHome}>
            Back To Home
          </button>
        </div>

        <p className="buy-tour-support">
          Need help? Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
        </p>
      </div>

      <AmsterdamSkyline />
    </div>
  );
}
