#!/usr/bin/env node
// Read-only Google Analytics 4 client for the /seo skill. No dependencies.
// Auth: GOOGLE_SERVICE_ACCOUNT_JSON_B64 via google.mjs (Viewer on the property).
// Scope: analytics.readonly only. Prints JSON to stdout; never prints the key.
//
//   node .agents/tools/ga4.mjs setup                       # property, timezone, web streams
//   node .agents/tools/ga4.mjs report --kind overview|pages|landing|sources
//                                     [--days 90 | --start YYYY-MM-DD --end YYYY-MM-DD] [--organic]
//
// --property defaults to ga4.property_id in .seo/config.json. Dates are in the property's timezone.

import { accessToken, parseArgs, request, seoConfig } from './google.mjs';

const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const ADMIN = 'https://analyticsadmin.googleapis.com/v1beta';
const DATA = 'https://analyticsdata.googleapis.com/v1beta';

const m = (...names) => names.map((name) => ({ name }));
const KINDS = {
  overview: { dimensions: [], metrics: m('sessions', 'totalUsers', 'engagedSessions', 'screenPageViews', 'keyEvents') },
  pages: { dimensions: m('pagePath'), metrics: m('screenPageViews', 'sessions', 'totalUsers') },
  landing: { dimensions: m('landingPage'), metrics: m('sessions', 'engagedSessions', 'keyEvents') },
  sources: {
    dimensions: m('sessionDefaultChannelGroup', 'sessionSource', 'sessionMedium'),
    metrics: m('sessions', 'engagedSessions', 'keyEvents'),
  },
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  const id = args.property || seoConfig().ga4?.property_id;
  if (!id) throw new Error('no --property and no ga4.property_id in .seo/config.json');
  const property = `properties/${String(id).replace(/^properties\//, '')}`;
  const token = await accessToken(SCOPE);
  let out;

  if (cmd === 'setup') {
    const p = await request(token, 'GET', `${ADMIN}/${property}`);
    const s = await request(token, 'GET', `${ADMIN}/${property}/dataStreams`);
    out = {
      property, display_name: p.displayName, time_zone: p.timeZone, currency: p.currencyCode,
      streams: (s.dataStreams || []).map((d) => ({
        stream: d.name, type: d.type,
        measurement_id: d.webStreamData?.measurementId, default_uri: d.webStreamData?.defaultUri,
      })),
    };
  } else if (cmd === 'report') {
    const kind = args.kind || 'overview';
    const spec = KINDS[kind];
    if (!spec) throw new Error(`--kind must be one of ${Object.keys(KINDS).join(', ')}`);
    const dateRange = args.start && args.end
      ? { startDate: args.start, endDate: args.end }
      : { startDate: `${Number(args.days || 90)}daysAgo`, endDate: 'yesterday' };
    const body = { dateRanges: [dateRange], ...spec, limit: 10000, keepEmptyRows: false };
    if (args.organic) {
      body.dimensionFilter = { filter: { fieldName: 'sessionDefaultChannelGroup', stringFilter: { value: 'Organic Search' } } };
    }
    const rows = [];
    let metadata;
    for (let offset = 0; ; offset += 10000) {
      const r = await request(token, 'POST', `${DATA}/${property}:runReport`, { ...body, offset });
      metadata = r.metadata;
      rows.push(...(r.rows || []).map((row) => ({
        ...Object.fromEntries((row.dimensionValues || []).map((v, i) => [spec.dimensions[i].name, v.value])),
        ...Object.fromEntries(row.metricValues.map((v, i) => [spec.metrics[i].name, Number(v.value)])),
      })));
      if (rows.length >= (r.rowCount || 0)) break;
    }
    out = { property, kind, organic: Boolean(args.organic), ...dateRange, rows, no_data: rows.length === 0, metadata };
  } else {
    throw new Error('usage: ga4.mjs setup | report --kind overview|pages|landing|sources [--days N] [--organic]');
  }
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

main().catch((e) => { console.error(String(e.message || e)); process.exit(1); });
