// ============================================
// THANH DINH — CV LANDING PAGE
// Interactive JavaScript
// ============================================

(function () {
  'use strict';

  // --- Typing Effect ---
  const typingPhrases = [
    'Senior Software Engineer',
    'Backend Architect',
    'Blockchain Developer',
    'AI & Automation Builder',
    'Cloud-Native Specialist',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.getElementById('typingText');

  function typeEffect() {
    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typingEl.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex++;
      typingEl.textContent = currentPhrase.substring(0, charIndex);
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      delay = 400;
    }

    setTimeout(typeEffect, delay);
  }

  typeEffect();

  // --- Scroll Animations (Intersection Observer) ---
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // --- Counter Animation ---
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counter when hero stats become visible
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          statsObserver.unobserve(statsSection);
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // --- Navbar Scroll Effect ---
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.style.color = 'var(--text-primary)';
        } else {
          link.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
