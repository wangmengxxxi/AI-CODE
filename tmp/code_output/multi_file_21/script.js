// 工具函数
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// 初始化年份
$('#current-year').textContent = new Date().getFullYear();

// === 倒计时模块 ===
function updateCountdown() {
  const dates = {
    'first-meet': $('#date-first-meet').value,
    'confession': $('#date-confession').value,
    'anniversary': $('#date-anniversary').value,
  };

  Object.entries(dates).forEach(([key, dateStr]) => {
    const el = $(`#date-${key} ~ .days`);
    if (!dateStr) {
      el.textContent = '— 天';
      return;
    }
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    el.textContent = diffDays === 0 
      ? '今天！❤️' 
      : diffDays > 0 
        ? `+${diffDays} 天` 
        : `${diffDays} 天`;
  });
}

// 加载本地存储的日期
function loadCountdownDates() {
  const saved = JSON.parse(localStorage.getItem('loveCountdown') || '{}');
  Object.entries(saved).forEach(([key, date]) => {
    const input = $(`#date-${key}`);
    if (input && date) input.value = date;
  });
  updateCountdown();
}

// 保存日期到 localStorage
$$('.date-input').forEach(input => {
  input.addEventListener('change', () => {
    const key = input.id.split('-')[1];
    const data = JSON.parse(localStorage.getItem('loveCountdown') || '{}');
    data[key] = input.value;
    localStorage.setItem('loveCountdown', JSON.stringify(data));
    updateCountdown();
  });
});

// === 时间轴模块 ===
let timelineItems = JSON.parse(localStorage.getItem('timeline') || '[]');

function renderTimeline() {
  const list = $('#timeline-list');
  list.innerHTML = '';
  timelineItems.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${item.title}</h3>
      <div class="date">${formatDate(item.date)}</div>
      <div class="content">${item.content}</div>
      <div class="actions">
        <button class="btn btn-secondary edit-btn" data-index="${i}">✏️ 编辑</button>
        <button class="btn btn-danger delete-btn" data-index="${i}">🗑️ 删除</button>
      </div>
    `;
    list.appendChild(li);
  });

  // 绑定事件（委托）
  list.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const i = +e.target.dataset.index;
      const item = timelineItems[i];
      const title = prompt('事件标题：', item.title);
      const date = prompt('日期（YYYY-MM-DD）：', item.date);
      const content = prompt('内容：', item.content);
      if (title && date && content) {
        timelineItems[i] = { title, date, content };
        localStorage.setItem('timeline', JSON.stringify(timelineItems));
        renderTimeline();
      }
    } else if (e.target.classList.contains('delete-btn')) {
      if (confirm('确定删除该事件？')) {
        timelineItems.splice(+e.target.dataset.index, 1);
        localStorage.setItem('timeline', JSON.stringify(timelineItems));
        renderTimeline();
      }
    }
  });
}

$('#add-timeline-btn').addEventListener('click', () => {
  const title = prompt('事件标题：');
  const date = prompt('日期（YYYY-MM-DD）：');
  const content = prompt('内容：');
  if (title && date && content) {
    timelineItems.push({ title, date, content });
    localStorage.setItem('timeline', JSON.stringify(timelineItems));
    renderTimeline();
  }
});

// === 照片墙模块 ===
let photoList = JSON.parse(localStorage.getItem('photos') || '[]');

function renderGallery() {
  const grid = $('#photo-grid');
  grid.innerHTML = '';
  photoList.forEach(photo => {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.innerHTML = `
      <img src="${photo.url}" alt="${photo.caption || '恋爱瞬间'}">
      <div class="caption">${photo.caption || ''}</div>
    `;
    grid.appendChild(div);
  });
}

$('#add-photo-btn').addEventListener('click', () => {
  const url = prompt('请输入图片 URL（建议使用 HTTPS）：');
  if (!url) return;
  const caption = prompt('添加说明（可选）：');
  photoList.push({ url, caption });
  localStorage.setItem('photos', JSON.stringify(photoList));
  renderGallery();
});

// === 情书便签模块 ===
let letters = JSON.parse(localStorage.getItem('letters') || '[]');

function renderLetters() {
  const list = $('#letters-list');
  list.innerHTML = '';
  letters.slice().reverse().forEach(letter => {
    const div = document.createElement('div');
    div.className = 'letter-item';
    div.innerHTML = `
      <div class="meta">
        <span>${formatDate(letter.date)}</span>
        <span>第 ${letters.indexOf(letter) + 1} 封</span>
      </div>
      <div class="content">${letter.text}</div>
    `;
    list.appendChild(div);
  });
}

$('#save-letter-btn').addEventListener('click', () => {
  const text = $('#letter-input').value.trim();
  if (!text) return;
  letters.push({
    text,
    date: new Date().toISOString().split('T')[0]
  });
  localStorage.setItem('letters', JSON.stringify(letters));
  $('#letter-input').value = '';
  renderLetters();
});

// 工具函数
function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadCountdownDates();
  renderTimeline();
  renderGallery();
  renderLetters();
});