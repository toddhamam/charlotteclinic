#!/usr/bin/env node
// Read-only Google Search Console client for the /seo skill. No dependencies.
// Auth: service-account JSON, base64-encoded, in GOOGLE_SERVICE_ACCOUNT_JSON_B64.
// Scope: webmasters.readonly only. Prints JSON to stdout; never prints the key.
//
//   node .agents/tools/gsc.mjs sites
//   node .agents/tools/gsc.mjs search   --dim page|query|date|none [--days 90 | --start YYYY-MM-DD --end YYYY-MM-DD]
//                                       [--state all]  (include fresh, unfinalised days)
//   node .agents/tools/gsc.mjs sitemaps
//   node .agents/tools/gsc.mjs inspect  [--url <url> ...]   (default: every <loc> in ./sitemap.xml)
//
// --site defaults to gsc.site_url in .seo/config.json.

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const API = 'https://searchconsole.googleapis.com';

function parseArgs(argv) {
  const out = { _: [], url: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const k = a.slice(2), v = argv[++i];
    if (k === 'url') out.url.push(v); else out[k] = v;
  }
  return out;
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

async function accessToken() {
  const sa = credentials();
  const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const aud = sa.token_uri || 'https://oauth2.googleapis.com/token';
  const unsigned = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url({
    iss: sa.client_email, scope: SCOPE, aud, iat: now, exp: now + 3600,
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

async function call(token, method, path, payload) {
  const res = await fetch(API + path, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = body.error || {};
    throw new Error(`${method} ${path}: ${res.status} ${e.status || ''} ${e.message || ''}`);
  }
  return body;
}

const ymd = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

function window(args) {
  if (args.start && args.end) return { startDate: args.start, endDate: args.end };
  // End three days back to skip Search Console's unfinalised recent data.
  const days = Number(args.days || 90);
  return { startDate: ymd(daysAgo(days + 2)), endDate: ymd(daysAgo(3)) };
}

function defaultSite() {
  try { return JSON.parse(readFileSync('.seo/config.json', 'utf8')).gsc?.site_url || null; }
  catch { return null; }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  const site = args.site || defaultSite();
  const token = await accessToken();
  const enc = encodeURIComponent(site || '');
  const need = () => { if (!site) throw new Error('no --site and no gsc.site_url in .seo/config.json'); };
  let out;

  if (cmd === 'sites') {
    out = await call(token, 'GET', '/webmasters/v3/sites');
  } else if (cmd === 'search') {
    need();
    const dim = args.dim || 'page';
    const win = window(args);
    const rows = [];
    for (let startRow = 0; ; startRow += 25000) {
      const r = await call(token, 'POST', `/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
        ...win, type: 'web', dataState: args.state || 'final', rowLimit: 25000, startRow,
        dimensions: dim === 'none' ? [] : dim.split(','),
      });
      rows.push(...(r.rows || []));
      if (!r.rows || r.rows.length < 25000) break;
    }
    out = { site, ...win, dimensions: dim, rows, no_data: rows.length === 0 };
  } else if (cmd === 'sitemaps') {
    need();
    out = await call(token, 'GET', `/webmasters/v3/sites/${enc}/sitemaps`);
  } else if (cmd === 'inspect') {
    need();
    const urls = args.url.length ? args.url
      : [...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    out = { site, results: [] };
    for (const url of urls) {
      const r = await call(token, 'POST', '/v1/urlInspection/index:inspect', { inspectionUrl: url, siteUrl: site });
      out.results.push({ url, ...r.inspectionResult });
    }
  } else {
    throw new Error('usage: gsc.mjs sites | search --dim page|query|date|none | sitemaps | inspect [--url U]');
  }
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

main().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
