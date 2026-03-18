// === 工具函数 ===
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// === 导航高亮（滚动监听） ===
const navLinks = $$('nav .nav-link');
const sections = $$('section');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach(section => observer.observe(section));

// === 英雄轮播组件 ===
const carousel = $('#heroesCarousel');
const track = carousel.querySelector('.carousel-track');
const items = carousel.querySelectorAll('.carousel-item');
const dotsContainer = $('#carouselDots');
const prevBtn = carousel.querySelector('.prev');
const nextBtn = carousel.querySelector('.next');

let currentIndex = 0;

// 初始化圆点
items.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('type', 'button');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});
const dots = $$('.carousel-dots button');

const updateDots = () => {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
};

const goToSlide = (index) => {
  currentIndex = index;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  items.forEach(item => item.classList.remove('active'));
  items[currentIndex].classList.add('active');
  updateDots();
};

const nextSlide = () => {
  currentIndex = (currentIndex + 1) % items.length;
  goToSlide(currentIndex);
};

const prevSlide = () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  goToSlide(currentIndex);
};

// 绑定事件
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// 自动轮播（可选，已注释；如需启用请取消注释）
// setInterval(nextSlide, 5000);

// 初始化
goToSlide(0);

// === 移动端菜单切换 ===
const navToggle = $('.nav-toggle');
const navMenu = $('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// 关闭移动端菜单点击链接后
$$('nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// === 平滑锚点滚动 ===
$$('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});