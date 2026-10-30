# Source of truth

Derived from the repository on 2026-10-29. This is what fact-check prompts and page copy are scored against.
This is a static marketing site with no application code, so the "code" side of each claim is the page that
owns the fact (booking prices are mirrored from Cliniko and may drift). Re-derive whenever booking.html,
practitioners.html or contact.html change, and whenever the clinic reports a Cliniko price change.

| Claim | Value | Source | Read |
|---|---|---|---|
| Business name | The Qi Collective (formerly Charlotte Clinic) | CLAUDE.md, every page `<title>` | 2026-10-29 |
| Address | 22 Kensington Road, Rose Park SA 5067 | contact.html:93 | 2026-10-29 |
| Email | hello@theqicollective.com.au | contact.html:86 | 2026-10-29 |
| Phone | none published on the site | absent from all pages | 2026-10-29 |
| Hours | Mon–Fri 8am–6pm · Sat 8am–3pm · Sun closed | contact.html:98-102 | 2026-10-29 |
| Founder | Charlotte Powell | about.html | 2026-10-29 |
| Practitioners | Charlotte Powell, Annabelle Boehm, Kate O'Leary, Prue Klausener (4; Emily Floreani left, removed in #27) | practitioners.html | 2026-10-30 |
| Registration | All four AHPRA and CMBA registered; AACMA badge on Charlotte, Annabelle, Kate (not Prue) | practitioners.html credential badges | 2026-10-30 |
| "Doctor" title | Charlotte: "AHPRA registered Doctor of Chinese Medicine" (README says "Doctor of Traditional Chinese Medicine") | practitioners.html:206, README.md | 2026-10-29 |
| Booking | Online via each practitioner's Cliniko page; Rose Park business for every practitioner | booking.html | 2026-10-29 |
| Initial acupuncture price | Charlotte $166 (75m) · Annabelle $160 (75m) · Kate $150 (75m) · Prue $160 (90m) | booking.html | 2026-10-29 |
| Follow-up acupuncture price | Charlotte $100 (45m) / $133 (60m) · Annabelle $120 (60m) · Kate $120 · Prue $120 | booking.html | 2026-10-29 |
| Cupping | $70 (30m) where priced | booking.html | 2026-10-29 |
| Paediatric | Initial $100 (45m), follow-up $70 (30m), Charlotte and Annabelle | booking.html | 2026-10-29 |
| Cosmetic acupuncture | Annabelle $180 initial / $150 follow-up · Prue $170 | booking.html | 2026-10-29 |
| Health fund rebates | "may be available; please check with your health fund" (no HICAPS claim) | booking.html, practitioners.html | 2026-10-29 |
| Services | Acupuncture, cupping, Chinese herbal medicine, Chinese dietetics, cosmetic acupuncture, paediatric acupuncture, Reiki/Universal Healing, Shiatsu, Qigong movement classes, workshops | services.html | 2026-10-29 |

## Services NOT offered (negatives)

| Service | Status | Source |
|---|---|---|
| Dry needling | no | absent from services.html |
| Physiotherapy / chiropractic | no | absent |
| Massage as a standalone service | no (Shiatsu/Tui Na only within treatments; Prue's "Express Neck & Shoulder" is cupping + Shiatsu) | booking.html |
| Telehealth | not offered on site | absent |
| Bulk billing / Medicare | no | absent |

## HIGH-RISK claims (health advertising)

Statements on the live site that should be reviewed against AHPRA's advertising guidelines by the clinic before
the skill edits them. These are flagged for review, not confirmed breaches. They are mechanically checked in
`truth-checks.json` so the list stays visible every run until a human decides.

| Claim on site | Where | Why it is high-risk |
|---|---|---|
| Cupping "draw[s] toxins from the tissue and muscles" | services.html (Cupping) | Detox claim with no acceptable evidence |
| Cupping marks "provide us with an explanation of underlying pathology" | services.html (Cupping) | Diagnostic claim |
| Cosmetic acupuncture "stimulates the release of collagen" and improves "fine lines, wrinkles, sagging skin" | services.html (Cosmetic) | Specific physiological/outcome claim |
| Acupressure tools "can work with equal effect to needles" | services.html (Paediatric) | Comparative efficacy claim about children |
| "Acupuncture may assist with conditions such as … respiratory issues, hay fever / allergies, fertility …" | services.html (Acupuncture) | Condition list; acceptable evidence varies by condition |
| Specialties list: endometriosis and PCOS, depression, breech presentation, morning sickness | specialties.html | Named conditions, including pregnancy and mental health |

## Contradictions found

| Claim | Code says | Site says | Which is right |
|---|---|---|---|
| Doctor title wording | README: "Doctor of Traditional Chinese Medicine (TCM)" | practitioners.html: "Doctor of Chinese Medicine" | Site wording is used publicly; confirm with Charlotte |
| Spelling of paediatric | services.html heading: "Pediatric Acupuncture" | everywhere else: "Paediatric" | "Paediatric" (Australian English). Corrected in services.html 2026-10-30; the production check follows the merge |
| Business name in directories | site: The Qi Collective | web search 2026-10-29 found no listing under the new name | Unknown: Google Business Profile and directories not checked (no access) |
