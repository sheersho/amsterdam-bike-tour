const PROD_API_BASE_URL = 'https://bike-tour-backend.billsbiketour.workers.dev';

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
