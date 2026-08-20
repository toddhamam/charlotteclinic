/* ============================================
   The Qi Collective - Practitioner Gallery
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.querySelector('[data-practitioner-gallery]');
  const profiles = Array.from(document.querySelectorAll('[data-practitioner-profile]'));

  if (!gallery || !profiles.length) return;

  const section = document.querySelector('.practitioners-page');
  const header = document.querySelector('.header');
  const galleryHeading = document.getElementById('practitioner-gallery-title');
  const galleryLinks = Array.from(document.querySelectorAll('[data-practitioner-link]'));
  const backButtons = Array.from(document.querySelectorAll('[data-practitioner-back]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const names = profiles.map(profile => profile.dataset.practitionerProfile);

  function scrollToSection() {
    if (!section) return;

    const offset = header ? header.offsetHeight : 0;
    const top = section.getBoundingClientRect().top + window.pageYOffset - offset - 16;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
    });
  }

  function focusHeading(heading) {
    if (!heading) return;
    window.setTimeout(() => heading.focus({ preventScroll: true }), 320);
  }

  // Shows a single profile, or the gallery when practitioner is null/unknown.
  function render(practitioner, options = {}) {
    const { focus = true, scroll = true } = options;
    const active = names.includes(practitioner) ? practitioner : null;

    gallery.hidden = Boolean(active);

    profiles.forEach(profile => {
      profile.hidden = profile.dataset.practitionerProfile !== active;
    });

    if (scroll) {
      scrollToSection();
    }

    if (focus) {
      focusHeading(active
        ? document.querySelector(`[data-practitioner-profile="${active}"] .practitioner-card__content h2`)
        : galleryHeading);
    }

    return active;
  }

  function addressFor(practitioner) {
    const url = new URL(window.location.href);

    if (practitioner) {
      url.searchParams.set('practitioner', practitioner);
      url.hash = `practitioner-${practitioner}`;
    } else {
      url.searchParams.delete('practitioner');
      url.hash = '';
    }

    return `${url.pathname}${url.search}${url.hash}`;
  }

  function requestedPractitioner() {
    const fromQuery = new URLSearchParams(window.location.search).get('practitioner');
    if (fromQuery) return fromQuery;

    const hash = window.location.hash;
    return hash.startsWith('#practitioner-') ? hash.slice('#practitioner-'.length) : null;
  }

  galleryLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Let modified clicks open the profile in a new tab/window as usual.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

      event.preventDefault();
      const active = render(link.dataset.practitionerLink);
      window.history.pushState({ practitioner: active }, '', addressFor(active));
    });
  });

  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      render(null);
      window.history.pushState({ practitioner: null }, '', addressFor(null));
    });
  });

  window.addEventListener('popstate', function() {
    render(requestedPractitioner(), { focus: false, scroll: false });
  });

  const initial = render(requestedPractitioner(), { focus: false, scroll: false });
  window.history.replaceState({ practitioner: initial }, '', addressFor(initial));
});
