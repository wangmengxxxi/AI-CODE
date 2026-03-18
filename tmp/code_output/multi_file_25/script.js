// DOM Ready wrapper
document.addEventListener('DOMContentLoaded', function () {
  // === Mobile Navigation Toggle ===
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      
      // Animate hamburger → X
      const spans = this.querySelectorAll('span');
      if (!isExpanded) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        spans[3].style.transform = 'rotate(0deg)';
      } else {
        spans[0].style.transform = 'rotate(0deg)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0deg)';
        spans[3].style.transform = 'rotate(0deg)';
      }
    });
  }

  // === Smooth Anchor Scrolling ===
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 72; // height of sticky header
        const elementPosition = targetElement.offsetTop - headerOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          const spans = navToggle.querySelectorAll('span');
          spans[0].style.transform = 'rotate(0deg)';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'rotate(0deg)';
          spans[3].style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // === Auto-update footer year ===
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // === Accessibility: Focus management on skip link ===
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        // Remove tabindex after focus for clean UX
        setTimeout(() => target.removeAttribute('tabindex'), 300);
      }
    });
  }

  // === Enhance external links (optional, for future extensibility) ===
  // Not added per spec — kept minimal and focused
});