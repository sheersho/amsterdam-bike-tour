const PROD_API_BASE_URL = 'https://bike-tour-backend.billsbiketour.workers.dev';
export const TOUR_PURCHASE_REQUIRED_MESSAGE = 'Your previous tour access has expired. Please buy a new tour to continue.';

function getDefaultApiBaseUrl() {
  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return '/api';
  }

  return PROD_API_BASE_URL;
}

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  getDefaultApiBaseUrl()
).replace(/\/+$/, '');

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function readError(response, fallbackMessage) {
  const payload = await parseJson(response);
  return payload?.error || fallbackMessage;
}

function isNetworkError(error) {
  return error instanceof TypeError && /failed to fetch/i.test(error.message || '');
}

function withNetworkMessage(error, fallbackMessage) {
  if (isNetworkError(error)) {
    throw new Error(fallbackMessage);
  }

  throw error;
}

function normalizeAuthError(error) {
  const message = String(error?.message || '');
  const requiresNewTour = error?.status === 403
    || /not authorized for this tour/i.test(message)
    || /access revoked/i.test(message)
    || /session expired/i.test(message)
    || /buy a new tour/i.test(message);

  if (requiresNewTour) {
    const normalized = new Error(TOUR_PURCHASE_REQUIRED_MESSAGE);
    normalized.status = error?.status;
    throw normalized;
  }

  throw error;
}

export function isPurchaseRequiredError(error) {
  return String(error?.message || '') === TOUR_PURCHASE_REQUIRED_MESSAGE || error?.status === 403;
}

export async function requestMagicLink(email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizeEmail(email) }),
    });

    if (!response.ok) {
      throw new Error(await readError(response, 'Unable to send your access link right now.'));
    }

    return parseJson(response);
  } catch (error) {
    normalizeAuthError(error);
    withNetworkMessage(
      error,
      'Unable to reach the access service right now. Please check your connection and try again.',
    );
  }
}

export async function verifyMagicToken(token) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/verify?token=${encodeURIComponent(token)}`,
    );

    if (!response.ok) {
      const error = new Error(await readError(response, 'Invalid or expired token.'));
      error.status = response.status;
      throw error;
    }

    return parseJson(response);
  } catch (error) {
    normalizeAuthError(error);
    withNetworkMessage(
      error,
      'Unable to verify your access link right now. Please try again in a moment.',
    );
  }
}

export async function fetchTourContent(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/tour/content`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = new Error(await readError(response, 'Unable to load your tour right now.'));
      error.status = response.status;
      throw error;
    }

    return parseJson(response);
  } catch (error) {
    withNetworkMessage(
      error,
      'Unable to load your tour right now. Please check your connection and try again.',
    );
  }
}

export async function fetchTourStatus(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/tour/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = new Error(await readError(response, 'Unable to validate your session right now.'));
      error.status = response.status;
      throw error;
    }

    return parseJson(response);
  } catch (error) {
    withNetworkMessage(
      error,
      'Unable to validate your session right now. Please check your connection and try again.',
    );
  }
}
