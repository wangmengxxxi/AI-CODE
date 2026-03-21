// 📝 约会日记数据管理（本地存储）
class DiaryManager {
  constructor() {
    this.key = 'loveDiaryEntries';
  }

  // 获取所有日记（按日期倒序）
  getAll() {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw).sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
  }

  // 添加新日记
  add(entry) {
    const entries = this.getAll();
    entries.push({
      id: Date.now().toString(),
      ...entry
    });
    localStorage.setItem(this.key, JSON.stringify(entries));
  }

  // 删除日记
  remove(id) {
    const entries = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(this.key, JSON.stringify(entries));
  }
}

// 🎨 渲染日记卡片
function renderDiaryCards() {
  const diaryList = document.getElementById('diary-cards');
  const emptyState = document.getElementById('empty-state');
  const manager = new DiaryManager();
  const entries = manager.getAll();

  if (entries.length === 0) {
    diaryList.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  diaryList.innerHTML = entries.map(entry => `
    <article class="diary-card" data-id="${entry.id}">
      <div class="diary-card-header">
        <span class="diary-date">${formatDate(entry.date)}</span>
        <button class="diary-btn delete-btn" title="删除这条日记">×</button>
      </div>
      <h3 class="diary-title">${escapeHtml(entry.title)}</h3>
      <p class="diary-content">${escapeHtml(entry.content)}</p>
    </article>
  `).join('');

  // 绑定删除事件（事件委托）
  diaryList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const card = e.target.closest('.diary-card');
      const id = card.dataset.id;
      if (confirm('确定要删除这条约会日记吗？此操作不可撤销。')) {
        new DiaryManager().remove(id);
        renderDiaryCards(); // 刷新视图
      }
    }
  });
}

// 🔧 工具函数
function formatDate(isoString) {
  const d = new Date(isoString);
  return `${d.getFullYear()}年${(d.getMonth() + 1).toString().padStart(2, '0')}月${d.getDate().toString().padStart(2, '0')}日`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 🚀 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 表单提交处理
  const form = document.getElementById('diary-form');
  const manager = new DiaryManager();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!date || !title || !content) {
      alert('请填写完整信息（日期、标题、内容）');
      return;
    }

    manager.add({ date, title, content });
    form.reset();
    renderDiaryCards();

    // 提示成功（轻量反馈）
    const successMsg = document.createElement('p');
    successMsg.textContent = '✅ 日记已保存！';
    successMsg.style.cssText = `
      text-align: center; color: #4CAF50; margin: 1rem 0; font-weight: 500;
      animation: fadeIn 0.3s, fadeOut 0.3s 2.5s;
    `;
    form.parentNode.insertBefore(successMsg, form.nextSibling);

    // 自动移除提示
    setTimeout(() => successMsg.remove(), 3000);
  });

  // 首次渲染
  renderDiaryCards();
});