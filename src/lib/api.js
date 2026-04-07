const DEFAULT_API_BASE_URL = 'https://bike-tour-backend.billsbiketour.workers.dev';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  DEFAULT_API_BASE_URL
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

export async function requestMagicLink(email) {
  const response = await fetch(`${API_BASE_URL}/auth/send-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizeEmail(email) }),
  });

  if (!response.ok) {
    throw new Error(await readError(response, 'Unable to send your access link right now.'));
  }

  return parseJson(response);
}

export async function verifyMagicToken(token) {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify?token=${encodeURIComponent(token)}`,
  );

  if (!response.ok) {
    const error = new Error(await readError(response, 'Invalid or expired token.'));
    error.status = response.status;
    throw error;
  }

  return parseJson(response);
}

export async function fetchTourContent(token) {
  const response = await fetch(`${API_BASE_URL}/tour/content`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = new Error(await readError(response, 'Unable to load your tour right now.'));
    error.status = response.status;
    throw error;
  }

  return parseJson(response);
}
