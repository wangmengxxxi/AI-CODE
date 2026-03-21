// script.js
// 文章数据（模拟 CMS 数据源）
const BLOG_POSTS = [
  {
    id: 1,
    title: "CSS 容器查询实战指南",
    excerpt: "深入理解 container queries 如何解决响应式布局中的组件级响应需求，并通过真实案例演示最佳实践。",
    date: "2024-05-12",
    tags: ["frontend", "css"],
  },
  {
    id: 2,
    title: "我的数字极简主义实践",
    excerpt: "从关闭通知到归档旧项目，分享过去一年如何通过减法提升专注力与幸福感。",
    date: "2024-04-28",
    tags: ["life", "design"],
  },
  {
    id: 3,
    title: "用 Intersection Observer 实现轻量懒加载",
    excerpt: "不依赖任何库，仅用 20 行 JS 实现图片与组件的高性能懒加载，并附性能对比数据。",
    date: "2024-04-10",
    tags: ["frontend", "performance"],
  },
  {
    id: 4,
    title: "Figma 插件开发入门：从零到发布",
    excerpt: "手把手带你用 HTML/CSS/JS 开发第一个 Figma 插件，涵盖调试、权限配置与上线流程。",
    date: "2024-03-22",
    tags: ["design", "frontend"],
  },
];

// DOM 元素缓存
const articlesGrid = document.getElementById('articles-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');
const currentYearEl = document.getElementById('current-year');

// 初始化
function init() {
  renderArticles('all');
  bindEvents();
  setThemeFromSystem();
  updateCurrentYear();
}

// 渲染文章列表（支持按标签过滤）
function renderArticles(tag) {
  articlesGrid.innerHTML = '';
  
  const filtered = tag === 'all' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.tags.includes(tag));

  if (filtered.length === 0) {
    articlesGrid.innerHTML = '<p class="no-results">暂无该分类的文章</p>';
    return;
  }

  filtered.forEach(post => {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.innerHTML = `
      <h3>${post.title}</h3>
      <div class="meta">
        <span>${post.date}</span>
        <span>阅读 · ${Math.floor(Math.random() * 3) + 2} 分钟</span>
      </div>
      <p class="excerpt">${post.excerpt}</p>
      <div class="tags">
        ${post.tags.map(t => `<span class="tag">${getTagLabel(t)}</span>`).join('')}
      </div>
    `;
    articlesGrid.appendChild(card);
  });
}

// 标签映射（友好显示）
function getTagLabel(tag) {
  const map = {
    frontend: '前端',
    life: '生活',
    design: '设计',
    performance: '性能'
  };
  return map[tag] || tag;
}

// 事件绑定
function bindEvents() {
  // 过滤按钮
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderArticles(btn.dataset.tag);
    });
  });

  // 主题切换
  themeToggle.addEventListener('click', toggleTheme);

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
}

// 主题控制
function setThemeFromSystem() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
}

// 更新页脚年份
function updateCurrentYear() {
  currentYearEl.textContent = new Date().getFullYear();
}

// 启动
document.addEventListener('DOMContentLoaded', init);