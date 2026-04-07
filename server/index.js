import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAQ, STOPS } from '../src/data/tourdata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, 'allowed-users.json');

const PORT = Number(process.env.AUTH_PORT || 8787);
const TOKEN_TTL_HOURS = Number(process.env.AUTH_TOKEN_TTL_HOURS || 48);
const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'dev-only-change-me';
const APP_BASE_URL = (process.env.APP_BASE_URL || 'http://localhost:5173').replace(/\/+$/, '');
const sessions = new Map();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function readAccessConfig() {
  const raw = fs.readFileSync(usersFilePath, 'utf8');
  const parsed = JSON.parse(raw);
  return {
    allowedEmails: Array.isArray(parsed.allowedEmails) ? parsed.allowedEmails.map(normalizeEmail) : [],
    blockedEmails: Array.isArray(parsed.blockedEmails) ? parsed.blockedEmails.map(normalizeEmail) : [],
  };
}

function isEmailAllowed(email) {
  const normalized = normalizeEmail(email);
  const { allowedEmails, blockedEmails } = readAccessConfig();
  if (!normalized) return false;
  if (blockedEmails.includes(normalized)) return false;
  return allowedEmails.includes(normalized);
}

function base64urlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64urlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signToken(email, issuedAt, expiresAt) {
  const payload = JSON.stringify({
    email,
    issued_at: issuedAt,
    expires_at: expiresAt,
  });
  const encodedPayload = base64urlEncode(payload);
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  const [encodedPayload, signature] = String(token || '').split('.');
  if (!encodedPayload || !signature) return null;
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64urlDecode(encodedPayload));
    if (!payload?.email || !payload?.issued_at || !payload?.expires_at) return null;
    if (Number(payload.expires_at) <= Date.now()) return null;
    return {
      email: normalizeEmail(payload.email),
      issuedAt: Number(payload.issued_at),
      expiresAt: Number(payload.expires_at),
    };
  } catch {
    return null;
  }
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice('Bearer '.length).trim();
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 404, { error: 'Not found.' });
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/auth/send-link') {
    try {
      const body = await readJsonBody(req);
      const email = normalizeEmail(body.email);
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        sendJson(res, 400, { error: 'Enter a valid email address.' });
        return;
      }

      if (!isEmailAllowed(email)) {
        sendJson(res, 403, { error: 'This account is not authorized for this tour.' });
        return;
      }

      const issuedAt = Date.now();
      const expiresAt = Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000;
      const token = signToken(email, issuedAt, expiresAt);
      sessions.set(token, { email, expiresAt });
      const magicLink = `${APP_BASE_URL}/access?token=${token}`;
      sendJson(res, 200, { ok: true, email, expiresAt, magicLink });
      return;
    } catch {
      sendJson(res, 400, { error: 'Invalid request body.' });
      return;
    }
  }

  if (req.method === 'GET' && requestUrl.pathname === '/auth/verify') {
    const token = requestUrl.searchParams.get('token') || '';
    if (!token) {
      sendJson(res, 401, { error: 'Missing token.' });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      sendJson(res, 401, { error: 'Invalid or expired token.' });
      return;
    }

    if (!sessions.has(token)) {
      sendJson(res, 401, { error: 'Invalid or expired token.' });
      return;
    }

    if (!isEmailAllowed(payload.email)) {
      sendJson(res, 403, { error: 'Access revoked for this account.' });
      return;
    }

    sendJson(res, 200, {
      email: payload.email,
      expiresAt: payload.expiresAt,
      expiresInHours: Math.max(0, Math.ceil((payload.expiresAt - Date.now()) / (60 * 60 * 1000))),
    });
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/tour/content') {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { error: 'Missing token.' });
      return;
    }

    const payload = verifyToken(token);
    if (!payload || !sessions.has(token)) {
      sendJson(res, 401, { error: 'Invalid or expired token.' });
      return;
    }

    if (!isEmailAllowed(payload.email)) {
      sendJson(res, 403, { error: 'Access revoked for this account.' });
      return;
    }

    sendJson(res, 200, {
      email: payload.email,
      waypoints: STOPS,
      faq: FAQ,
    });
    return;
  }

  sendJson(res, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
