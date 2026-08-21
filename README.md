# The Qi Collective - Acupuncture & Chinese Medicine

A website for The Qi Collective, a multidisciplinary acupuncture, Chinese medicine, and holistic wellbeing clinic in Rose Park, Adelaide.

## Project Overview

This website serves as the digital presence for The Qi Collective, providing information about its services and multidisciplinary practitioner team while enabling potential clients to book appointments and get in contact.

### Client: Charlotte Powell

- **Credentials**: AHPRA registered Acupuncturist, Doctor of Traditional Chinese Medicine (TCM), Universal Healing (Reiki) Practitioner
- **Memberships**: AACMA (Australian Acupuncture and Chinese Medicine Association), CMBA (Chinese Medicine Board of Australia)
- **Current Personal Site**: [charlottepowell.com.au](https://www.charlottepowell.com.au)

### Services Offered

- Acupuncture
- Cupping
- Chinese Herbal Medicine
- Chinese Dietetics
- Cosmetic Acupuncture
- Paediatric Acupuncture
- Reiki/Universal Healing

### Special Interests

- Women's Health
- Mental/Emotional Health
- Paediatrics
- Peri-Natal Care (pre-conception through postpartum)

## Website Requirements

### Phase 1 (Current Scope)

- **Basic informational site** serving as a reference point for the business
- About section (practitioner bio, qualifications, approach)
- Services overview
- Booking/Contact functionality (direct contact via phone/email/form)
- Practitioners information
- Mobile-responsive design

### Phase 2 (Future Consideration)

- E-commerce capability for selling products/supplements (small component)
- Potential merge with personal brand website

## Design Direction

### Aesthetic

- Minimal and elegant
- Clean lines with calming, soothing atmosphere
- Warm, earthy tones
- Consistent with personal brand at charlottepowell.com.au

### Reference Sites

- [Zhong Centre](https://zhongcentre.com) - Chinese medicine clinic aesthetic
- [Felice Acupuncture](https://www.feliceacupuncture.com) - Clean acupuncture clinic design

### Color Palette (Initial Direction)

- **Primary**: Warm cream/off-white (#FAF8F5)
- **Secondary**: Sage green (#8B9D83)
- **Accent**: Soft terracotta (#C4A484)
- **Text**: Warm charcoal (#3D3D3D)

### Typography

- Clean, elegant serif for headings
- Readable sans-serif for body text

## Tech Stack

- HTML5
- CSS3 (with CSS Custom Properties for theming)
- Vanilla JavaScript (minimal, for interactions)
- Static site (can be hosted on any platform)

## Project Structure

```
charlotteclinic/
├── index.html          # Homepage
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── main.js         # JavaScript (minimal)
├── images/             # Image assets
└── README.md           # This file
```

## Changelog

### Clean URLs Without the `.html` Extension
- Added `vercel.json` enabling `cleanUrls`, so pages are served at `/practitioners` rather than `/practitioners.html`, and the homepage at `/`
- Old addresses keep working: Vercel now issues a permanent redirect from `/practitioners.html` to `/practitioners`, so existing links, bookmarks, and search results are preserved rather than broken
- Enabled `trailingSlash: false` so `/practitioners/` also redirects to the canonical `/practitioners`
- Rewrote all 127 internal links across the seven pages to the extensionless form, including the query-string and anchor variants used by the practitioner gallery and booking flow, so in-site navigation never takes a redirect hop
- No JavaScript changes were needed; the gallery and booking scripts derive their addresses from `window.location`, so shareable `?practitioner=` links follow the new form automatically

### Practitioner Titles, Bio, Pricing, and Booking Link Corrections
- Fixed the Services page call to action, which said "Book a Consultation" but linked to the Contact page; it now goes to the booking page
- Removed the four practice-scope notes from the bottom of the Specialties cards, including the copy about coordinating care with your GP or specialist
- Changed Charlotte's role from "Doctor of Chinese Medicine / Universal Healing (Reiki) Practitioner" to "Classical Chinese Medicine Practitioner / Acupuncturist / Universal Healing (Reiki) Practitioner" across her gallery tile, full profile, booking selector, booking summary, and portrait alt text
- Added "Classical" to Kate's role on her gallery tile, full profile, booking selector, and booking summary
- Replaced Charlotte's profile biography with her supplied rewrite, which leads the commitment paragraph differently, adds Spiritual to her wellbeing interests, and introduces her recent further study in Chinese Herbal Medicine in place of the previous closing paragraph
- Pointed the Instagram icon in every page footer at the clinic account `@theqicollective_` instead of Charlotte's personal account; the per-practitioner links inside each profile still point at their own accounts
- Synced Charlotte's booking prices with Cliniko: initial acupuncture to $166, acupuncture follow-ups to $100 and $133, paediatric initial to $100, paediatric follow-up and cupping to $70, and Reiki 60 min to $144
- Charlotte's Reiki 45 min has no published price in Cliniko, so the card now defers to "Price shown at booking" rather than showing a stale figure
- Corrected two of Emily's prices that had also drifted: Acupuncture + Reiki to $120, and Cupping to "Price shown at booking" since Cliniko publishes no price for it
- Booking prices are hardcoded in `booking.html` and do not update automatically when they change in Cliniko; they can be re-checked against the `data-price` attributes on each practitioner's public Cliniko booking page

### Practitioner Gallery and Online Booking for Annabelle and Kate
- Added Annabelle Boehm to the booking portal with her eleven Cliniko appointment types grouped into Acupuncture, Acupuncture + Reiki, Cosmetic Acupuncture, Paediatric Acupuncture, and Cupping
- Added Kate O'Leary to the booking portal with her four Cliniko appointment types grouped into Acupuncture, Acupuncture + Reiki, and Cupping; her Acupuncture × Reiki price is hidden in Cliniko, so the card shows the duration and defers the price to the booking page
- Pointed the "Book with Annabelle" and "Book with Kate" links on the Practitioners page at the in-site booking flow, matching Charlotte and Emily
- Every practitioner now has online booking, so the "setup coming soon" state no longer appears on the booking page
- Reworked the Practitioners page into a gallery of portrait tiles showing each practitioner's role, approach, and focus areas, so the page stays short as the team grows
- Selecting a tile opens that practitioner's existing full profile on its own, with "All practitioners" links at the top and bottom, shareable `?practitioner=` addresses, and working browser back/forward
- Promoted the team paragraph into the Practitioners page subheadline, replacing the shorter tagline and lifting the gallery directly under the page header
- Without JavaScript the gallery is skipped and every full profile is rendered as before

### Contact Email Domain Correction
- Corrected the clinic contact address on the Contact page from `hello@thechicollective.com.au` to `hello@theqicollective.com.au`, updating both the `mailto:` link and the visible text
- Audited every page for the misspelled domain; the Contact page held the only occurrence, and the practitioner addresses on the Practitioners page were already correct

### Mobile Navigation Motion
- Slowed the mobile drawer to a 1.5-second reveal with a synchronized closing delay for a calmer, brand-aligned transition
- Reworked the six navigation links into an overlapping wave stagger, with each link gliding smoothly into place as the drawer settles
- Preserved the existing instant-transition treatment for visitors who prefer reduced motion

### Homepage Hero Typography and Scroll Cue
- Rebalanced the homepage hero typography, line lengths, spacing, and responsive sizing for a clearer visual hierarchy
- Added an accessible animated gold line that prompts visitors to continue into the welcome section, including hover and keyboard-focus treatments
- Centered the animated line within its touch target so it stays aligned at the bottom center across mobile widths and high-density displays
- Preserved a static cue and instant anchor navigation for visitors who prefer reduced motion

### Shared Agent Handoff Workflow
- Added the repository-scoped `$shit-it-out-hard` Codex skill for reviewing, documenting, verifying, committing, pushing, and opening a pull request for all current changes
- Added the matching `/shititouthard` Conductor/Claude slash command so the same autonomous handoff can be started from the chat composer
- Included guardrails for merged branches, unrelated user work, secrets, destructive Git operations, and pull-request verification

### Studio Content and Brand Lockup Port
- Replaced the scenic homepage overlay with Charlotte's supplied Qi passage and refreshed the welcome image and mission statement
- Rebuilt the About page around the supplied founding story, Qi definition, mission, vision, nurturing-space language, and practitioner CTA
- Added the complete supplied biographies and public links for Charlotte, Annabelle, Kate, and Emily, including Emily's supplied web-ready portrait
- Removed the homepage FAQ section and its unused accordion code
- Adopted the supplied deep-teal, textured gold wordmark direction and “Balanced + Integrated Healing” lockup across every page
- Added only the four selected public-facing assets to `images/`; ingestion provenance remains private under gitignored `.context/`

### Clinic Content and Navigation Refresh
- Reframed the homepage around The Qi Collective, adding the Rose Park welcome copy and a dedicated mission statement while removing the testimonial section
- Expanded the practitioner roster to Charlotte Powell, Annabelle Boehm, Kate O'Leary, Emily Floreani, and Samara Holliday, with supplied roles, interests, credentials, and available portraits
- Redesigned the Services page as a responsive four-column card grid with seven treatments and expanded supplied copy for acupuncture, cupping, cosmetic acupuncture, paediatric acupuncture, and Reiki
- Added an accessible Services dropdown across the site for Services, Appointments, Movement, and Education/Workshops, with enquiry preselection for offerings without dedicated pages
- Updated Adelaide location references in page metadata and contact details

### Brand Logo Refresh
- Uses the supplied clean gold ripple mark as the source artwork for the header treatment
- Recreates the gold wordmark and “Balanced + Integrated Healing” tagline as a compact, accessible header lockup
- Uses the exact supplied textured teal-and-gold lockup in every footer
- Defines deep-teal and gold design tokens centrally in the site stylesheet

### Ocean Video Hero Background
- Added a subtle looping ocean video background to the homepage hero section
- Video sourced from Mixkit (free commercial license) showing gentle sunlight shimmering on water
- Teal-tinted gradient overlay preserves brand consistency and text readability
- Hero text updated to white/cream for contrast against the dark video background
- Respects `prefers-reduced-motion`: video is hidden and replaced with a static gradient for users who prefer reduced motion
- Video file: `images/ocean-bg.mp4` (~5 MB, 15s loop, 720p landscape)

## Development Notes

- Site should be easily maintainable by non-developers
- Clean, semantic HTML for accessibility
- Performance-focused (fast load times)
- SEO-friendly structure

## Contact

For questions about this project, contact the developer.

---

*This project is being developed as a client website for Charlotte Powell's acupuncture and Chinese medicine clinic.*
