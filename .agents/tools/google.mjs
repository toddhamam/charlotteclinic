// Shared helpers for the read-only Google clients (gsc.mjs, ga4.mjs). No dependencies.
// Auth: service-account JSON, base64-encoded, in GOOGLE_SERVICE_ACCOUNT_JSON_B64.
// Each client asks for its own read-only scope. Never prints the key.

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

export function parseArgs(argv) {
  const out = { _: [], url: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const k = a.slice(2);
    // Bare flags (no value, or followed by another flag) become true.
    const v = argv[i + 1] === undefined || argv[i + 1].startsWith('--') ? true : argv[++i];
    if (k === 'url') out.url.push(v); else out[k] = v;
  }
  return out;
}

export function seoConfig() {
  try { return JSON.parse(readFileSync('.seo/config.json', 'utf8')); }
  catch { return {}; }
}

function credentials() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64;
  if (!b64) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON_B64 is not set');
  const j = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  if (j.type !== 'service_account' || !j.client_email || !j.private_key) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON_B64 is not service-account JSON');
  }
  return j;
}

export async function accessToken(scope) {
  const sa = credentials();
  const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const aud = sa.token_uri || 'https://oauth2.googleapis.com/token';
  const unsigned = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url({
    iss: sa.client_email, scope, aud, iat: now, exp: now + 3600,
  })}`;
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url');
  const res = await fetch(aud, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${sig}`,
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`token: ${res.status} ${body.error || ''} ${body.error_description || ''}`);
  return body.access_token;
}

export async function request(token, method, url, payload) {
  const res = await fetch(url, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = body.error || {};
    throw new Error(`${method} ${new URL(url).pathname}: ${res.status} ${e.status || ''} ${e.message || ''}`);
  }
  return body;
}
