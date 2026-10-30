# The Qi Collective integration

Read this before every mode. This is the repository-specific integration of the SEO v2.2.0 package (the same package used in the healer-sites and funnel-builder repositories); it takes precedence over the package's generic examples.

## Site and scope

Operate only the public website of The Qi Collective, an acupuncture and Chinese medicine clinic at 22 Kensington Road, Rose Park SA 5067 (Adelaide, Australia), formerly known as Charlotte Clinic. The canonical origin is `https://www.theqicollective.com.au`; the apex domain 308-redirects to `www`. State belongs in this repository's `.seo/` directory, which is Git-tracked. Do not install globally or change other repositories.

Public pages are `/`, `/about`, `/services`, `/specialties`, `/practitioners`, `/booking` and `/contact`. `vercel.json` sets `cleanUrls: true` and `trailingSlash: false`, so canonical URLs, sitemap entries and internal links use the extensionless, no-trailing-slash form (`/about`, never `/about.html` or `/about/`).

Out of scope as targets: the practitioners' Cliniko booking pages (`*.cliniko.com`), each practitioner's personal website or social accounts (for example `charlottepowell.com.au`), Google Maps embeds and `.context/`. These may be read as research references only. Never copy patient information, booking data or private correspondence into `.seo/`.

All modes, including `aeo snapshot`, use this site as the target. Competitor research may read other clinics' public pages but never creates a foundation or authors work for them.

## Local health business priorities

This is a single-location local clinic, so local search outweighs national editorial reach. When scoring candidates, weight these heavily:

- Google Business Profile completeness, category, hours, photos and reviews (an off-page/needs-you action unless authenticated access exists).
- Consistent name, address and phone across the site, the Business Profile, directories and social profiles. Watch for leftover "Charlotte Clinic" citations from the rebrand and treat them as `correct` work.
- `LocalBusiness`/`MedicalBusiness` (or a more specific `MedicalClinic`) JSON-LD with address, geo, opening hours and `sameAs`, plus `Person` markup for practitioners using only facts published on `practitioners.html`.
- Relevant directories: AACMA's find-a-practitioner listing, Chinese Medicine Board / AHPRA register links, HealthEngine and similar Australian health directories.
- Suburb and service intent ("acupuncture Rose Park", "acupuncture Norwood", "fertility acupuncture Adelaide"). Use Australian English spelling (paediatrics, centre, behaviour).

## Health advertising gate (hard)

Practitioners here are AHPRA-registered Chinese medicine practitioners, so every public sentence is advertising of a regulated health service under the Health Practitioner Regulation National Law (section 133) and AHPRA's advertising guidelines. Before publishing or changing customer-facing copy, check the current AHPRA guidance and apply at minimum:

- No testimonials or reviews on the site that refer to clinical aspects or treatment outcomes, and no selective quoting of reviews.
- No claims that acupuncture or herbal medicine treats, cures or prevents a named condition unless supported by acceptable evidence, and no language creating an unreasonable expectation of benefit or encouraging unnecessary use of services.
- No "guaranteed", "best", "painless" or comparative-superiority claims; no invented statistics, outcomes or credentials.
- The title "Dr" / "Doctor" for Chinese medicine practitioners must make clear the person is not a medical practitioner (for example "Doctor of Chinese Medicine"); mirror the wording already on `practitioners.html`.
- Herbal medicine content must not promote specific herbs or products for conditions to the public.

Condition and specialty content (women's health, fertility, peri-natal, mental and emotional health, paediatrics, pain) is the highest-risk surface: describe how the practitioner works and what a consultation involves rather than promising results. When a draft cannot pass this gate, hold it and record the reason in `.seo/needs-you.md`; never weaken the gate to ship. New editorial pieces and any copy about conditions need human sign-off from the clinic before publication.

## Voice and content

Follow `CLAUDE.md` user preferences: personal, welcoming, authentic practitioner voice; evocative, meaningful headlines rather than purely functional ones; tranquil tone. Practitioner facts (qualifications, memberships, special interests) come only from `practitioners.html` and `README.md`. `.seo/brand.md` is context, not a replacement for the clinic's own words.

There is no blog yet. Whether to add one, who writes it and how often are open questions for the clinic; record the answer in `.seo/` once known rather than assuming. Until then prefer improving existing pages (dedicated specialty or service depth, FAQs that answer real patient questions) over creating an editorial library.

## Stack and operations

The site is static HTML, CSS and vanilla JavaScript with no build step, deployed on Vercel. None of the files under `references/stacks/` matches exactly; apply their patterns by editing each page's `<head>` directly. Put `sitemap.xml`, `robots.txt` and any `llms.txt` at the repository root. JSON-LD goes inline in `<script type="application/ld+json">` on the relevant page. Shared header/footer markup is duplicated across every HTML file, so site-wide changes must be applied to all seven pages consistently. Follow `.claude/rules` and the conventions in `CLAUDE.md`.

Preview locally with `python3 -m http.server 8080` from the repository root. That server does not emulate `cleanUrls`, so use `.html` paths locally and check canonical behaviour on a Vercel preview or production deployment.

Record notable site changes in `README.md` as the repository already does. Run SEO operations sequentially. Git mode starts at `none` (leave a reviewable diff); follow the user's active Git instructions. Merging and deploying require the user's authorisation.

## Connections and foundation

Installation on 29 October 2026 copied the skill only. It created no `.seo/` foundation, schedulers, GitHub Actions or Hermes jobs. The healer-sites and funnel-builder automation layers (daily brief, bounded implementation, KPI report rooms) are not part of this install and need separate authorisation.

At installation the site had no analytics tag, `sitemap.xml`, `robots.txt`, structured data, Open Graph tags or canonical links. Search Console, GA4, Bing Webmaster and Business Profile access were unverified. Detect actual connections with `references/setup.md` in the operating session; never infer a property from the domain. Keep credentials in the normal secret mechanism, never in `.seo/` or skill files. The paid-call budget starts at zero; every paid research batch needs a stated cost and explicit approval.

The first foundation run should seed brand context, truth claims and competitors from the repository and the clinic's answers rather than inventing them. Leave the questions the repository cannot answer (target services, catchment suburbs, competitors, Business Profile ownership, blog appetite) in `.seo/needs-you.md`.

## Search Console client

Search Console is connected through a service account, not an MCP server. The property is the domain property `sc-domain:theqicollective.com.au` (stored in `.seo/config.json` as `gsc.site_url`). The account `outreach-sheets-writer@healer-sites-outreach.iam.gserviceaccount.com` (project `healer-sites-outreach`, shared with the healer-sites repo) is a Full user on it. Its base64-encoded JSON key arrives through the charlotteclinic Conductor repository environment as `GOOGLE_SERVICE_ACCOUNT_JSON_B64`. Vercel environment variables do not reach a workspace, and a variable added after a workspace started needs a new session. Never print, log or commit the key.

`.agents/tools/gsc.mjs` is a dependency-free Node client. It signs a JWT with Node's built-in crypto and requests only the `webmasters.readonly` scope, so it cannot submit sitemaps, request indexing or change settings. Run it from the repository root. It prints JSON to stdout, so redirect raw output to the gitignored `.context/seo/`:

```sh
node .agents/tools/gsc.mjs sites                                  # properties + permission level
node .agents/tools/gsc.mjs search --dim page  --days 90 > .context/seo/gsc-page-$(date +%F).json
node .agents/tools/gsc.mjs search --dim query --days 90 > .context/seo/gsc-query-$(date +%F).json
node .agents/tools/gsc.mjs search --dim none  --days 90           # totals; also --dim date, --start/--end, --state all
node .agents/tools/gsc.mjs sitemaps
node .agents/tools/gsc.mjs inspect                                # every <loc> in sitemap.xml; or --url <url>
```

By default the 90-day window ends three days ago and uses finalised data only. `no_data: true` means Google has nothing to report yet, not zero traffic. Raw query and page rows stay in `.context/seo/`. Only aggregates (totals, per-page index status) go into `.seo/gsc/`. Where `tools.md` names MCP tools, use this client instead: `list_properties` maps to `sites`, `get_advanced_search_analytics` to `search`, `list_sitemaps_enhanced` to `sitemaps`, and `inspect_url_enhanced`/`batch_url_inspection` to `inspect`.
