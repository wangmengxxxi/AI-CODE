// script.js
document.addEventListener('DOMContentLoaded', function () {
  // Update copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Optional: Enhance accessibility for skip links
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #002F5F;
    color: white;
    padding: 0.5rem 1rem;
    text-decoration: none;
    z-index: 1000;
  `;
  skipLink.onfocus = () => {
    skipLink.style.top = '0';
  };
  skipLink.onblur = () => {
    skipLink.style.top = '-40px';
  };
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main landmark for accessibility
  const main = document.querySelector('main') || document.body;
  main.id = 'main-content';
  main.setAttribute('role', 'main');
});