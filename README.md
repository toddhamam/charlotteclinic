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

### Homepage Hero Typography and Scroll Cue
- Rebalanced the homepage hero typography, line lengths, spacing, and responsive sizing for a clearer visual hierarchy
- Added an accessible animated gold line that prompts visitors to continue into the welcome section, including hover and keyboard-focus treatments
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
