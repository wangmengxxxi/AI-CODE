// script.js
document.addEventListener('DOMContentLoaded', function () {
  // Update copyright year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });

        // Close mobile menu after click
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    });
  });

  // Highlight current section in nav based on scroll (basic)
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu a');

  window.addEventListener('scroll', function () {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.parentElement.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.parentElement.classList.add('active');
      }
    });
  });
});