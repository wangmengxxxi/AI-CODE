const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八'];
const resultEl = document.getElementById('result');
const btn = document.getElementById('drawBtn');

btn.addEventListener('click', () => {
  const randomName = names[Math.floor(Math.random() * names.length)];
  resultEl.textContent = `🎉 中奖者：${randomName}`;
  resultEl.style.color = '#e74c3c';
});