// script.js
document.addEventListener('DOMContentLoaded', function() {
  // 实时时间与模拟天气更新
  function updateWeather() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('current-time').textContent = `${hours}:${minutes}`;

    // 模拟温度（成都秋季典型范围）
    const temp = Math.floor(Math.random() * 6) + 18; // 18–23°C
    document.getElementById('current-temp').textContent = `${temp}°C`;

    const conditions = ['晴', '多云', '阴', '小雨'];
    const cond = conditions[Math.floor(Math.random() * conditions.length)];
    document.getElementById('current-condition').textContent = cond;
  }
  updateWeather();
  setInterval(updateWeather, 60000); // 每分钟更新

  // 平滑滚动导航
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

  // 导航高亮（根据滚动位置）
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
});