// Auto-update copyright year
document.getElementById('year').textContent = new Date().getFullYear();

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

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Simple mobile menu toggle (optional enhancement)
const navToggle = document.createElement('button');
navToggle.className = 'mobile-menu-toggle';
navToggle.innerHTML = '☰';
navToggle.setAttribute('aria-label', 'Toggle navigation menu');

const mainNav = document.querySelector('.main-nav');
if (mainNav && window.innerWidth <= 768) {
  mainNav.before(navToggle);

  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    navToggle.setAttribute(
      'aria-expanded',
      mainNav.classList.contains('active') ? 'true' : 'false'
    );
  });

  // Close menu when clicking a link
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}