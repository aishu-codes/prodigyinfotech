// Scroll-based navbar background + mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const YEAR = document.getElementById('year');

  // set year
  if (YEAR) YEAR.textContent = new Date().getFullYear();

  // Toggle 'scrolled' class based on scroll position
  function onScroll() {
    const offset = window.scrollY || window.pageYOffset;
    if (offset > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Initialize on load (in case page is loaded not at top)
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav toggle
  navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });

  // Close mobile menu when clicking a link (and smooth scroll)
  navMenu.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName.toLowerCase() === 'a') {
      // For same-page anchors, close menu after navigation
      // Allow default to run first (so hash changes). Use setTimeout to close.
      setTimeout(() => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }, 50);
    }
  });

  // Optional: close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  // Smooth scrolling for anchor links (modern browsers)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          const top = el.getBoundingClientRect().top + window.pageYOffset - (navbar.offsetHeight - 4);
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
});