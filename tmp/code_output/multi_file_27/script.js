// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Year auto-update in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.main-nav ul');

  if (hamburger && navList) {
    hamburger.addEventListener('click', function() {
      navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
      this.setAttribute('aria-expanded', navList.style.display === 'flex');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

  // Simple scroll reveal effect (lightweight alternative to libraries)
  const revealElements = document.querySelectorAll('.card, .timeline-item, .apply-card');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  // Initial reveal
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Observe scroll
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Run on load

  // Form submission simulation (for demo — no backend)
  const applyButtons = document.querySelectorAll('.btn-secondary');
  applyButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const url = this.getAttribute('href');
      alert(`You're being redirected to:\n${url}\n\nIn a real site, this would open UMKC's official admissions portal.`);
      // Optional: window.open(url, '_blank');
    });
  });
});