const btn = document.getElementById('themeToggle');
const body = document.body;
btn.addEventListener('click', () => {
  body.classList.toggle('dark');
  btn.textContent = body.classList.contains('dark') 
    ? '☀️ 亮色模式' 
    : '🌙 暗色模式';
});