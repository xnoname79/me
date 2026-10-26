// ============================================
// THANH DINH — CV LANDING PAGE
// Interactive JavaScript
// ============================================

(function () {
  'use strict';

  // --- Typing Effect ---
  const typingPhrases = [
    'Senior Software Engineer',
    'FinTech & Web3 Backend Architect',
    'Blockchain Developer',
    'AI Agent & MCP Builder',
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

  // --- Swipeable Project Cards (Tinder-style stack) ---
  const stack = document.getElementById('projectStack');

  if (stack) {
    const cards = Array.from(stack.querySelectorAll('.project-card'));
    const counter = document.getElementById('projectCounter');
    const total = cards.length;
    const SWIPE_THRESHOLD = 100; // px of horizontal drag that counts as a swipe
    const FLY_MS = 350;
    const order = cards.slice(); // order[0] is the card on top

    stack.classList.add('is-stack');
    document.getElementById('projectControls').hidden = false;

    function layout() {
      order.forEach((card, i) => {
        card.inert = i !== 0; // only the top card is clickable / focusable
        if ('flying' in card.dataset) return;
        const depth = Math.min(i, 2);
        card.style.zIndex = total - i;
        card.style.transform = `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`;
        card.style.opacity = i <= 2 ? 1 : 0;
      });
      counter.textContent = `${cards.indexOf(order[0]) + 1} / ${total}`;
    }

    function flyOut(card, dir) {
      card.style.zIndex = total + 1;
      card.style.transform = `translateX(${dir * 130}%) rotate(${dir * 20}deg)`;
      card.style.opacity = 0;
    }

    function next(dir) {
      const top = order.shift();
      order.push(top);
      top.dataset.flying = '';
      flyOut(top, dir);
      layout();
      setTimeout(() => {
        delete top.dataset.flying;
        layout();
      }, FLY_MS);
    }

    function prev() {
      const last = order.pop();
      order.unshift(last);
      delete last.dataset.flying;
      last.style.transition = 'none';
      flyOut(last, -1);
      last.offsetWidth; // commit the off-screen start position so it animates in
      last.style.transition = '';
      layout();
    }

    // Drag: pointer capture starts only after a real horizontal move, so plain clicks on links still work
    let startX = 0;
    let dx = 0;
    let dragging = false;
    let moved = false;

    stack.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || !order[0].contains(e.target)) return;
      dragging = true;
      moved = false;
      dx = 0;
      startX = e.clientX;
    });

    stack.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const top = order[0];
      dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 8) return;
        moved = true;
        top.classList.add('dragging');
        top.setPointerCapture(e.pointerId);
      }
      top.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`;
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      order[0].classList.remove('dragging');
      if (Math.abs(dx) > SWIPE_THRESHOLD) next(Math.sign(dx));
      else layout();
    }

    stack.addEventListener('pointerup', endDrag);
    stack.addEventListener('pointercancel', () => {
      dx = 0; // browser took over (e.g. vertical scroll): snap back
      endDrag();
    });
    stack.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        moved = false;
      }
    }, true);
    stack.addEventListener('dragstart', (e) => e.preventDefault());

    document.getElementById('projectNext').addEventListener('click', () => next(1));
    document.getElementById('projectPrev').addEventListener('click', prev);

    layout();
  }
})();
