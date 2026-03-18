// script.js
document.addEventListener('DOMContentLoaded', () => {
  // 🎮 轮播组件
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselItems = document.querySelectorAll('.carousel-item');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let currentIndex = 0;

  const updateCarousel = (index) => {
    carouselItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
      item.setAttribute('aria-hidden', i !== index);
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentIndex = index;
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % carouselItems.length;
    updateCarousel(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
    updateCarousel(prevIndex);
  };

  // 初始化轮播
  updateCarousel(0);

  // 绑定按钮事件
  nextBtn.addEventListener('click', goToNext);
  prevBtn.addEventListener('click', goToPrev);

  // 绑定点位事件
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => updateCarousel(i));
  });

  // ⚙️ 手风琴组件
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const panel = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // 关闭其他面板
      accordionHeaders.forEach(h => {
        if (h !== header) {
          h.setAttribute('aria-expanded', 'false');
          h.nextElementSibling.classList.remove('active');
        }
      });

      // 切换当前面板
      header.setAttribute('aria-expanded', !isExpanded);
      panel.classList.toggle('active', !isExpanded);
    });
  });

  // 🧭 平滑滚动 & 导航高亮
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

  // 导航高亮（ScrollSpy）
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // 📱 移动端菜单切换
  const hamburger = document.querySelector('.hamburger');
  const navLinksList = document.querySelector('.nav-links');

  if (hamburger && navLinksList) {
    hamburger.addEventListener('click', () => {
      navLinksList.style.display = navLinksList.style.display === 'flex' ? 'none' : 'flex';
      hamburger.classList.toggle('active');
    });
  }

  // 🔊 可访问性增强：键盘支持轮播
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrev();
  });
});