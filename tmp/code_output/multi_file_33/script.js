// script.js
// ===== 模块化功能封装 =====

// 1. 轮播图模块
class HeroSlider {
  constructor() {
    this.track = document.getElementById('sliderTrack');
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.dotsContainer = document.getElementById('sliderDots');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    this.createDots();
    this.bindEvents();
    this.updateDots();
    this.startAutoPlay();
  }

  createDots() {
    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `跳转到第${i + 1}张幻灯片`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  bindEvents() {
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    
    // 键盘支持
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // 触摸支持（简易版）
    let touchStartX = 0;
    let touchEndX = 0;
    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    this.track.addEventListener('touchend', (e) => {
      touchEndX = e.touches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (diff > 50) this.next();
      if (diff < -50) this.prev();
    });
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlide();
    this.updateDots();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlide();
    this.updateDots();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlide();
    this.updateDots();
  }

  updateSlide() {
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.slides[this.currentIndex].classList.add('active');
  }

  updateDots() {
    const dots = this.dotsContainer.querySelectorAll('button');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
      dot.setAttribute('aria-current', i === this.currentIndex ? 'true' : 'false');
    });
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// 2. 移动端菜单模块
class MobileMenu {
  constructor() {
    this.toggleBtn = document.getElementById('menuToggle');
    this.nav = document.getElementById('mainNav');
    this.init();
  }

  init() {
    this.toggleBtn.addEventListener('click', () => this.toggle());
    
    // 点击链接后关闭菜单
    const navLinks = this.nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.close();
        }
      });
    });
  }

  toggle() {
    this.nav.classList.toggle('active');
    this.toggleBtn.setAttribute('aria-expanded', this.nav.classList.contains('active'));
  }

  close() {
    this.nav.classList.remove('active');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
  }
}

// 3. 平滑滚动模块
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // 内部锚点链接
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          this.scrollToTarget(target);
          
          // 关闭移动端菜单（如果已打开）
          const mobileMenu = document.getElementById('mainNav');
          if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.getElementById('menuToggle').setAttribute('aria-expanded', 'false');
          }
        }
      });
    });
  }

  scrollToTarget(target) {
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const offsetTop = target.offsetTop - headerHeight;
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// 4. 页面加载增强
document.addEventListener('DOMContentLoaded', () => {
  // 初始化各模块
  new HeroSlider();
  new MobileMenu();
  new SmoothScroll();

  // 首屏动画（轻量级）
  const heroTitle = document.querySelector('.slide-content h1');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 300);
  }

  // 监听窗口大小变化：小屏时停止轮播自动播放
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        // 实际项目中可在此处暂停轮播
      }
    }, 250);
  });
});