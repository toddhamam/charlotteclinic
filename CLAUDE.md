# The Qi Collective Website

A static website for The Qi Collective acupuncture clinic (formerly Charlotte Clinic), built with vanilla HTML, CSS, and JavaScript.

## Tech Stack

- **HTML5** - Semantic markup with multi-page structure
- **CSS3** - Custom properties for design tokens, modular organization
- **Vanilla JavaScript** - No frameworks, progressive enhancement approach
- **Python dev server** - Run with `python3 -m http.server` (use `python3` as `python` may not exist on some systems; try alternate ports like 8080 or 8081 if default port 8000 is in use)

## Project Structure

```
├── index.html          # Homepage with Qi hero, welcome, mission, services, specialties, and Instagram feed
├── about.html          # About page
├── services.html       # Services offered
├── specialties.html    # Treatment specialties
├── practitioners.html  # Practitioner profiles
├── booking.html        # Appointment booking portal
├── contact.html        # Contact information
├── css/
│   └── styles.css      # Main stylesheet (organized by section)
├── js/
│   ├── main.js         # Navigation, animations, Instagram feed, and contact form behaviour
│   └── booking.js      # Booking system logic
└── images/             # Site images
```

## Design System

**Color Palette:**
- Deep teal (`--color-teal-deep`), teal, cream, charcoal, and gold accents
- Defined as CSS custom properties in `:root` - color changes are centralized here

**Typography:**
- Headings: Cormorant Garamond
- Body: Outfit
- Uses `clamp()` for responsive sizing

**Spacing:**
- CSS custom properties (e.g., `--space-md`, `--space-lg`)

## Key Patterns

- CSS custom properties for all design tokens
- `IntersectionObserver` for scroll-triggered animations
- `DOMContentLoaded` wrapper for all JS
- Mobile-first responsive design with grid stacking
- Accessible desktop/mobile Services dropdown
- SVG icons for scalability

## SEO / GEO

- Run `/seo` (or `/seo setup`, `/seo tech`, `/seo aeo audit`, etc.) to use the SEO/GEO skill
- The skill lives in `.agents/skills/seo/`; `.claude/skills/seo` is a symlink to it
- Site-specific scope, health advertising (AHPRA) gates and static-site conventions are in `.agents/skills/seo/references/qi-collective.md`
- Operating state goes in `.seo/` (tracked in Git; never store credentials there)
- Connected (30 Oct 2026): Google Search Console `sc-domain:theqicollective.com.au` and GA4 property `561626637` (tag `G-5YPQG9WN7F` on every page), both read through `.agents/tools/gsc.mjs` / `ga4.mjs` with the `GOOGLE_SERVICE_ACCOUNT_JSON_B64` key from the Conductor repository environment; Bing Webmaster via `BING_WEBMASTER_API_KEY`. Raw report rows go only in `.context/seo/`

## User Preferences

- **Tone**: Personal, welcoming, authentic practitioner voice
- **Headlines**: Evocative, meaningful (not purely functional)
- **Images**: Full display preferred over cropping
- **Animations**: Subtle fades and scales, tranquil feel
- **Mobile**: Polished experience with smooth slide navigation
