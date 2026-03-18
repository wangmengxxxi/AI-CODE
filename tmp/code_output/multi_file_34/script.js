// script.js
document.addEventListener('DOMContentLoaded', function() {
  // 导航平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Tab 切换功能
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 移除所有激活状态
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // 添加当前激活状态
      btn.classList.add('active');
      const targetPanel = document.getElementById(`${btn.dataset.tab}-panel`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 表单提交处理
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 简单验证
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      
      if (!name || !phone) {
        alert('请填写完整信息！');
        return;
      }

      // 模拟提交成功
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // 重置表单并显示提示
      this.reset();
      alert(`感谢咨询！\n学生：${data.name}\n年级：${data.grade}\n我们将尽快通过电话 ${data.phone} 与您联系。`);
    });
  }

  // 滚动时头部阴影增强
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.site-header');
    
    if (scrollTop > 50 && scrollTop > lastScrollTop) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
    }
    lastScrollTop = scrollTop;
  });

  // 首屏动画初始化（轻量级）
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.about-card, .gallery-item, .tab-panel').forEach(el => {
    observer.observe(el);
  });
});