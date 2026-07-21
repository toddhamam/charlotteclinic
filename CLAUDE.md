# The Qi Collective Website

A static website for The Qi Collective acupuncture clinic (formerly Charlotte Clinic), built with vanilla HTML, CSS, and JavaScript.

## Tech Stack

- **HTML5** - Semantic markup with multi-page structure
- **CSS3** - Custom properties for design tokens, modular organization
- **Vanilla JavaScript** - No frameworks, progressive enhancement approach
- **Python dev server** - Run with `python3 -m http.server` (use `python3` as `python` may not exist on some systems; try alternate ports like 8080 or 8081 if default port 8000 is in use)

## Project Structure

```
├── index.html          # Homepage with hero, welcome, mission, services, and FAQ
├── about.html          # About page
├── services.html       # Services offered
├── specialties.html    # Treatment specialties
├── practitioners.html  # Practitioner profiles
├── booking.html        # Appointment booking portal
├── contact.html        # Contact information
├── css/
│   └── styles.css      # Main stylesheet (organized by section)
├── js/
│   ├── main.js         # Navigation, animations, FAQ accordion
│   └── booking.js      # Booking system logic
└── images/             # Site images
```

## Design System

**Color Palette:**
- Teal (`--color-sage`), cream, charcoal, terracotta accents
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
- Accessible desktop/mobile Services dropdown and FAQ accordion
- SVG icons for scalability

## User Preferences

- **Tone**: Personal, welcoming, authentic practitioner voice
- **Headlines**: Evocative, meaningful (not purely functional)
- **Images**: Full display preferred over cropping
- **Animations**: Subtle fades and scales, tranquil feel
- **Mobile**: Polished experience with smooth slide navigation
