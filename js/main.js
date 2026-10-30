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

  // ============================================
  // Instagram Feed
  // ============================================
  // The hand-built posts in the HTML are the fallback. When the section has a
  // data-feed-url (a Behold or Simpleembed JSON feed), live posts replace them as the section
  // nears the viewport, so the feed is only requested by visitors who reach it.
  const socialFeed = document.querySelector('.social-feed');

  if (socialFeed) {
    const feedTrack = socialFeed.querySelector('.social-feed__track');
    const feedUrl = socialFeed.dataset.feedUrl;
    const MIN_POSTS = 10;
    const MAX_POSTS = 12;

    function postMarkup() {
      // Reuse the first hand-built post as the template, so live posts match exactly.
      const template = feedTrack.querySelector('li').cloneNode(true);
      template.querySelector('.ig-post__media').innerHTML = '';
      return template;
    }

    // Accepts posts from either a Behold or a Simpleembed JSON feed.
    function normalisePost(post) {
      const size = post.sizes && post.sizes.medium;
      return {
        permalink: post.permalink,
        imageUrl: post.imageUrl || (size && size.mediaUrl) || post.thumbnailUrl || post.mediaUrl,
        width: size && size.width,
        height: size && size.height,
        alt: post.altText,
        caption: post.prunedCaption || post.caption || '',
        isVideo: post.mediaType === 'VIDEO' || Boolean(post.isReel),
        slides: post.childCount || (post.children ? post.children.length : 0)
      };
    }

    // Show the whole image at its own ratio, within Instagram's 3:4 to 1.91:1 range.
    function setRatio(media, width, height) {
      if (!width || !height) return;
      media.style.aspectRatio = String(Math.min(Math.max(width / height, 0.75), 1.91));
    }

    function buildPost(template, post) {
      const item = template.cloneNode(true);
      const link = item.querySelector('.ig-post');
      const media = item.querySelector('.ig-post__media');
      const image = document.createElement('img');

      link.href = post.permalink;
      image.src = post.imageUrl;
      image.alt = post.alt || 'Instagram post from The Qi Collective';
      image.loading = 'lazy';
      media.appendChild(image);

      if (post.width && post.height) {
        setRatio(media, post.width, post.height);
      } else {
        image.addEventListener('load', () => setRatio(media, image.naturalWidth, image.naturalHeight), { once: true });
      }

      if (post.isVideo) {
        media.insertAdjacentHTML('beforeend', '<svg class="ig-post__reel" aria-hidden="true"><use href="#ig-reel"/></svg>');
      } else if (post.slides > 1) {
        const count = document.createElement('span');
        count.className = 'ig-post__count';
        count.setAttribute('aria-hidden', 'true');
        count.textContent = `1/${post.slides}`;
        media.appendChild(count);
      }

      const caption = item.querySelector('.ig-post__caption');
      const handle = caption.querySelector('b');
      caption.textContent = ` ${post.caption}`;
      caption.prepend(handle);

      return item;
    }

    function startDrift() {
      if (prefersReducedMotion.matches) return;

      // Repeat short feeds (and keep an even count for the staggered layout) so
      // one set is always wider than the screen, then double it for a seamless loop.
      const originals = Array.from(feedTrack.children);
      while (feedTrack.children.length < MIN_POSTS || feedTrack.children.length % 2) {
        originals.forEach(item => feedTrack.appendChild(item.cloneNode(true)));
      }

      Array.from(feedTrack.children).forEach(item => feedTrack.appendChild(item.cloneNode(true)));

      // Only the original posts are announced and focusable; the repeats are decorative.
      Array.from(feedTrack.children).slice(originals.length).forEach(item => {
        item.setAttribute('aria-hidden', 'true');
        item.querySelectorAll('a').forEach(link => link.setAttribute('tabindex', '-1'));
      });

      socialFeed.classList.add('is-drifting');
    }

    function loadLiveFeed() {
      return fetch(feedUrl)
        .then(response => {
          if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
          return response.json();
        })
        .then(feed => {
          const posts = (feed.posts || []).map(normalisePost).filter(post => post.permalink && post.imageUrl).slice(0, MAX_POSTS);
          if (!posts.length) return;

          const template = postMarkup();
          feedTrack.replaceChildren(...posts.map(post => buildPost(template, post)));
        })
        .catch(() => {
          // Keep the hand-built posts if the feed is unavailable.
        });
    }

    if (!feedUrl) {
      startDrift();
    } else {
      const feedObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        feedObserver.disconnect();
        loadLiveFeed().then(startDrift);
      }, { rootMargin: '600px 0px' });

      feedObserver.observe(socialFeed);
    }
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
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
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
