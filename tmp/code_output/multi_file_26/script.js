// script.js
document.addEventListener('DOMContentLoaded', function() {
  // 校训文字逐字浮现动画
  const motto = document.querySelector('.school-slogan');
  const mottoText = motto.textContent;
  motto.textContent = '';
  
  let index = 0;
  const interval = setInterval(() => {
    if (index < mottoText.length) {
      motto.textContent += mottoText.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 150);

  // 时间轴点击高亮
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.addEventListener('click', function() {
      timelineItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 平滑滚动导航
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

  // 滚动时添加头部阴影
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
    }
  });

  // CTA按钮点击事件
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
      document.querySelector('#history').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 校徽悬停3D效果增强（需支持3D变换的浏览器）
  const emblem = document.getElementById('emblem');
  if (emblem) {
    emblem.addEventListener('mouseenter', () => {
      emblem.style.transform = 'rotateY(360deg) rotateX(360deg) scale(1.1)';
    });
    
    emblem.addEventListener('mouseleave', () => {
      emblem.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
  }

  // 页面加载完成提示（仅开发时启用）
  console.log('%c资阳中学官网已就绪 🌟', 'color:#b8860b;font-weight:bold;font-size:1.2em;');
});