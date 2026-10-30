# The Qi Collective — SEO Roadmap

> Canonical tracker. Lives at `.seo/roadmap.md`. A single-location clinic has little use for large programmatic batches, so this roadmap is mostly technical foundations, local search and a small set of owner pages. Created 2026-10-29 from the first measure run; phases after 0 are proposals pending the clinic's answers (needs-you NY-1, NY-2).

## Phase Status Tracker

| # | Phase | Pattern | Status | PR |
|---|---|---|---|---|
| 0 | Technical foundations | Setup | in_progress: items 1–5 done 2026-10-30 (sitemap, robots, canonicals, schema, OG); llms.txt and analytics open | branch `toddhamam/seo-measure-baseline` (PR TBD) |
| 1 | Local entity: Google Business Profile, name/address consistency, directories | Off-page | blocked: needs Business Profile access (NY-4) | – |
| 2 | Health-claim review fixes on /services and /specialties | Correct | blocked: clinic review (NY-3) | – |
| 3 | Speed: hero video and images | Repair | pending | – |
| 4 | Owner pages for priority specialties (e.g. fertility & pregnancy acupuncture) | Editorial | proposed: needs demand evidence + clinic sign-off | – |
| 5 | Blog / articles | Editorial | undecided (NY-2) | – |

**Conventions:** `pending` → `in_progress` → `completed` in the same commit as the PR; `skipped` with a reason if abandoned.

## Reference Data

### 1. Site facts

- **Domain:** https://www.theqicollective.com.au (apex 308 → www)
- **GSC property:** not connected
- **Bing site:** not connected
- **Authority / playable bucket:** unknown → easy (cold start, 2026-10-29)
- **Stack:** static HTML/CSS/vanilla JS on Vercel, `cleanUrls: true`, `trailingSlash: false`
- **Brand accent color:** #005E5A teal-deep, #DDBB72 gold
- **Hero font / body font:** Cormorant Garamond / Outfit
- **Marketing pages root:** repository root (`*.html`)

### 2. Critical files

| File | What lives there |
|---|---|
| `index.html` … `contact.html` | each page's full markup, including its own `<head>`, header and footer (duplicated) |
| `css/styles.css` | design tokens in `:root`, section styles |
| `js/main.js` | nav, scroll animations, contact form |
| `js/booking.js` | booking portal steps |
| `vercel.json` | clean URLs, trailing slash |

## Phases

### Phase 0 — Technical foundations

Found by the 2026-10-29 health diff and scripts:

1. `sitemap.xml` at the root listing the 7 extensionless URLs (no build-date lastmod).
2. `robots.txt` allowing all and pointing at the sitemap.
3. `<link rel="canonical">` on all 7 pages (also collapses `?practitioner=` and `?subject=` variants).
4. JSON-LD: `MedicalClinic`/`LocalBusiness` on home and contact (name, address, opening hours, email, `sameAs` Instagram), `Person` for practitioners, `BreadcrumbList` optional.
5. Open Graph / Twitter tags for link previews.
6. `llms.txt` summarising the clinic, its services and practitioners (passes the health advertising gate).
7. Analytics (GA4 or Vercel Analytics) so outcomes can be measured. Needs the clinic's decision on which account (NY-5).

Verification gate: health diff shows 0 canonical/schema violations; Rich Results test passes; sitemap fetches 200.

## Off-page checklist

### Directory and citation targets (Australia, health)

| Target | Why | Status |
|---|---|---|
| Google Business Profile | local pack and Maps; biggest local lever | NY-4 |
| AACMA Find a Practitioner | professional body listing, trusted backlink | to check |
| Healthdirect service finder | government health directory; already lists Norwood acupuncture | to check |
| HealthEngine / Bookwell / Fresha | directories that dominate local results | to check |
| Yellow Pages / True Local | citation consistency | to check |
| Apple Maps, Bing Places | secondary map listings | to check |
| Old "Charlotte Clinic" / charlottepowell.com.au listings | update or redirect to the new name | to check |
