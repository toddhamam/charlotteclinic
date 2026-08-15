/* ============================================
   Charlotte Clinic - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // ============================================
  // Scroll Animations with Intersection Observer
  // ============================================
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  const heroVideo = document.querySelector('.hero__video');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (heroVideo && !prefersReducedMotion.matches) {
    heroVideo.play().catch(() => {
      // The static teal fallback remains visible if the browser blocks playback.
    });
  }

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav__list');
  const header = document.querySelector('.header');
  const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
  const mobileNavMedia = window.matchMedia('(max-width: 900px)');

  function closeDropdowns(exceptItem) {
    dropdownItems.forEach(item => {
      if (item !== exceptItem) {
        item.classList.remove('is-open');
        item.querySelector('.nav__dropdown-toggle').setAttribute('aria-expanded', 'false');
      }
    });
  }

  dropdownItems.forEach(item => {
    const toggle = item.querySelector('.nav__dropdown-toggle');

    toggle.addEventListener('click', function(event) {
      event.stopPropagation();
      const willOpen = !item.classList.contains('is-open');

      closeDropdowns(item);
      item.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });
  });

  document.addEventListener('click', function() {
    closeDropdowns();
  });

  // Create overlay element for mobile nav
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  function closeNav() {
    navList.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    closeDropdowns();
  }

  function openNav() {
    navList.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle && navList) {
    navToggle.setAttribute('aria-label', 'Open navigation');

    navToggle.addEventListener('click', function() {
      if (navList.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close mobile nav when clicking overlay
    navOverlay.addEventListener('click', function() {
      closeNav();
      navToggle.focus();
    });

    // Close mobile nav when clicking a link
    const navLinks = navList.querySelectorAll('a.nav__link, .nav__dropdown-link');
    navLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openDropdown = document.querySelector('.nav__item--dropdown.is-open');

        if (openDropdown) {
          const openToggle = openDropdown.querySelector('.nav__dropdown-toggle');
          closeDropdowns();
          openToggle.focus();
        } else if (navList.classList.contains('active')) {
          closeNav();
          navToggle.focus();
        }
      }
    });

    // Reset the drawer if the device rotates or expands to desktop width.
    mobileNavMedia.addEventListener('change', function(event) {
      if (!event.matches) {
        closeNav();
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = header ? header.offsetHeight : 88;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header scroll effect
  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      } else {
        header.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    });
  }

  // Simple form handling (placeholder - can be connected to backend)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const requestedSubject = new URLSearchParams(window.location.search).get('subject');
    const subjectSelect = contactForm.querySelector('#subject');

    const hasRequestedSubject = Array.from(subjectSelect.options).some(option => option.value === requestedSubject);

    if (requestedSubject && hasRequestedSubject) {
      subjectSelect.value = requestedSubject;
    }

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Placeholder: Log form data (replace with actual form submission)
      console.log('Form submitted:', data);

      // Show simple confirmation (can be replaced with better UX)
      alert('Thank you for your message! We will be in touch soon.');
      contactForm.reset();
    });
  }

});
