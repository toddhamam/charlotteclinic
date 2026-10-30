#!/usr/bin/env node
// Read-only Google Search Console client for the /seo skill. No dependencies.
// Auth: GOOGLE_SERVICE_ACCOUNT_JSON_B64 via google.mjs.
// Scope: webmasters.readonly only. Prints JSON to stdout; never prints the key.
//
//   node .agents/tools/gsc.mjs sites
//   node .agents/tools/gsc.mjs search   --dim page|query|date|none [--days 90 | --start YYYY-MM-DD --end YYYY-MM-DD]
//                                       [--state all]  (include fresh, unfinalised days)
//   node .agents/tools/gsc.mjs sitemaps
//   node .agents/tools/gsc.mjs inspect  [--url <url> ...]   (default: every <loc> in ./sitemap.xml)
//
// --site defaults to gsc.site_url in .seo/config.json.

import { readFileSync } from 'node:fs';
import { accessToken, parseArgs, request, seoConfig } from './google.mjs';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const API = 'https://searchconsole.googleapis.com';

const call = (token, method, path, payload) => request(token, method, API + path, payload);

const ymd = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 86400000);

function window(args) {
  if (args.start && args.end) return { startDate: args.start, endDate: args.end };
  // End three days back to skip Search Console's unfinalised recent data.
  const days = Number(args.days || 90);
  return { startDate: ymd(daysAgo(days + 2)), endDate: ymd(daysAgo(3)) };
}

const defaultSite = () => seoConfig().gsc?.site_url || null;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  const site = args.site || defaultSite();
  const token = await accessToken(SCOPE);
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
