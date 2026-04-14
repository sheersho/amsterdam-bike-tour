const SESSION_KEY = 'ride_session_v1';
const RETURN_URL_KEY = 'ride_return_url';

export function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Merge patch fields into existing session and persist
export function patchSession(patch) {
  const current = readSession() || {};
  const updated = { ...current, ...patch };
  writeSession(updated);
  return updated;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(RETURN_URL_KEY);
}

// Store the content URL before redirecting to Stripe (client-side backup)
export function saveReturnUrl(url) {
  localStorage.setItem(RETURN_URL_KEY, url);
}

export function readReturnUrl() {
  return localStorage.getItem(RETURN_URL_KEY) || null;
}

export function clearReturnUrl() {
  localStorage.removeItem(RETURN_URL_KEY);
}

// True once the unlock window has passed
export function isSessionExpired(session) {
  if (!session?.unlock_expires_at) return false;
  return new Date(session.unlock_expires_at) < new Date();
}

// True if session exists, has a session_id, and is not expired
export function sessionIsValid(session) {
  if (!session?.session_id) return false;
  if (!session.is_paid) return true; // unpaid sessions don't expire
  return !isSessionExpired(session);
}
