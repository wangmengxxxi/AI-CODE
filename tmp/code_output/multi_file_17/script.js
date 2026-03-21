const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️ 亮色模式' : '🌙 暗色模式';
});