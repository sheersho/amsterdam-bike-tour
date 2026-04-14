import { API_BASE_URL } from './api';

export const TOUR_PRICE_DISPLAY = '€9.99';

// ─── Dev mock (set VITE_DEV_MOCK=true in .env.local) ─────────────────────────
const DEV_MOCK = import.meta.env.VITE_DEV_MOCK === 'true';

function mockSession(entryPoint) {
  return {
    session_id: 'dev-session-' + Date.now(),
    entry_point: entryPoint,
    entry_source: 'qr_shared',
    is_paid: false,
    paid_at: null,
    unlock_expires_at: null,
    current_stop_id: { central_station: 1, anne_frank: 4, skinny_bridge: 8 }[entryPoint] ?? 1,
    last_content_url: null,
    email: null,
  };
}

async function handleRes(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

// POST /ride/session
// → { session_id, entry_point, is_paid, created_at, unlock_expires_at, current_stop_id, last_content_url, email }
export async function createRideSession({ entryPoint }) {
  if (DEV_MOCK) return mockSession(entryPoint);
  const res = await fetch(`${API_BASE_URL}/ride/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entry_point: entryPoint, entry_source: 'qr_shared' }),
  });
  return handleRes(res);
}

// GET /ride/session/:id
// → same shape as createRideSession response
export async function getRideSession(sessionId) {
  if (DEV_MOCK) {
    // In dev mode read straight from localStorage so the rest of the app works normally
    try {
      const raw = localStorage.getItem('ride_session_v1');
      return raw ? JSON.parse(raw) : { session_id: sessionId, is_paid: false };
    } catch {
      return { session_id: sessionId, is_paid: false };
    }
  }
  const res = await fetch(`${API_BASE_URL}/ride/session/${sessionId}`);
  return handleRes(res);
}

// PUT /ride/session/:id/stop  — keeps backend in sync as user progresses
export async function updateSessionStop(sessionId, { currentStopId, lastContentUrl }) {
  if (DEV_MOCK) return { ok: true };
  const res = await fetch(`${API_BASE_URL}/ride/session/${sessionId}/stop`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current_stop_id: currentStopId, last_content_url: lastContentUrl }),
  });
  return handleRes(res);
}

// POST /ride/checkout
// Backend creates Stripe Checkout Session with:
//   success_url = APP_BASE_URL + /ride/return?ride_session={session_id}
//   cancel_url  = APP_BASE_URL + last_content_url
//   metadata    = { ride_session_id, flow_version: 'v1', entry_point }
// → { checkout_url }
export async function createCheckout({ sessionId, lastContentUrl }) {
  if (DEV_MOCK) {
    // Simulate instant payment: skip Stripe, go straight to return page
    return { checkout_url: `/ride/return?ride_session=${sessionId}&dev_paid=1` };
  }
  const res = await fetch(`${API_BASE_URL}/ride/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, last_content_url: lastContentUrl }),
  });
  return handleRes(res);
}

// POST /ride/session/:id/email  — optional, only after is_paid
export async function saveRideEmail({ sessionId, email }) {
  if (DEV_MOCK) return { ok: true };
  const res = await fetch(`${API_BASE_URL}/ride/session/${sessionId}/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleRes(res);
}

// GET /ride/config — public, read by frontend on ride start
// → { payments_enabled: true }
export async function getRideConfig() {
  if (DEV_MOCK) return { payments_enabled: true };
  const res = await fetch(`${API_BASE_URL}/ride/config`);
  return handleRes(res);
}

// GET /admin/flags — staff only, requires X-Admin-Key header
export async function getAdminFlags(adminKey) {
  const res = await fetch(`${API_BASE_URL}/admin/flags`, {
    headers: { 'X-Admin-Key': adminKey },
  });
  return handleRes(res);
}

// PUT /admin/flags — toggle feature flags
// body: { payments_enabled: true/false }
export async function setAdminFlags(adminKey, flags) {
  const res = await fetch(`${API_BASE_URL}/admin/flags`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
    body: JSON.stringify(flags),
  });
  return handleRes(res);
}

// Poll until is_paid = true or max attempts exhausted
export async function pollSessionUntilPaid(sessionId, maxAttempts = 5, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    const session = await getRideSession(sessionId);
    if (session.is_paid) return session;
    if (i < maxAttempts - 1) {
      await new Promise(r => setTimeout(r, intervalMs));
    }
  }
  throw new Error('Payment confirmation is taking longer than expected. Please refresh the page.');
}
