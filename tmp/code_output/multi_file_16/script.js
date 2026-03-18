// 模拟博客文章数据（支持扩展至 50+ 篇）
const POSTS = [
  {
    id: "1",
    title: "如何写出可维护的 CSS？从 BEM 到原子化",
    date: "2024-04-12",
    excerpt: "脱离框架后，CSS 的组织方式决定长期维护成本。本文分享我在三个项目中的演进实践。",
    content: `
      <p>在构建大型单页应用时，CSS 往往成为技术债重灾区。我们曾因命名冲突导致按钮样式被意外覆盖，也曾因全局样式污染影响第三方组件。</p>
      <p>经过多次重构，我总结出三条原则：</p>
      <ul>
        <li><strong>作用域优先</strong>：用 CSS Modules 或 Shadow DOM 封装样式边界；</li>
        <li><strong>语义化命名</strong>：BEM 提供清晰结构，如 <code>.card__header--large</code>；</li>
        <li><strong>工具辅助</strong>：PostCSS 插件自动添加前缀 + CSS 自定义属性管理主题。</li>
      </ul>
      <p>最后，警惕“原子化 CSS”的幻觉——它简化了编写，却可能增加认知负担。关键不是少写类名，而是让每个类名都有明确意图。</p>
    `
  },
  {
    id: "2",
    title: "读《有限与无限的游戏》：重新理解职业成长",
    date: "2024-03-28",
    excerpt: "当把「升职加薪」当作唯一目标时，我们已默认自己在玩一场有限游戏。",
    content: `
      <p>詹姆斯·卡斯提醒我们：有限游戏以取胜为目的，规则、边界与参与者皆被设定；无限游戏则以延续游戏本身为目标。</p>
      <p>程序员常陷入有限游戏陷阱：比工龄、比职级、比技术栈热度。而真正的无限玩家关注——</p>
      <ol>
        <li>能否持续提出好问题？</li>
        <li>是否拓展了他人解决问题的能力？</li>
        <li>有没有让系统变得更健壮、更包容？</li>
      </ol>
      <p>后者无法量化，却定义了长期价值。</p>
    `
  },
  {
    id: "3",
    title: "用纯 CSS 实现响应式网格卡片（无 JS）",
    date: "2024-03-15",
    excerpt: "Flexbox + minmax() + auto-fit —— 三行代码撑起全屏自适应布局。",
    content: `
      <p>核心代码：</p>
      <pre><code>.grid {<br>  display: grid;<br>  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))));<br>  gap: 1.5rem;<br>}</code></pre>
      <p>原理简析：</p>
      <ul>
        <li><code>minmax(300px, 1fr)</code>：每列最小 300px，最大均分剩余空间；</li>
        <li><code>auto-fit</code>：自动收缩空列，避免空白；</li>
        <li>配合 <code>max-width</code> 和 <code>margin: 0 auto</code> 完美居中。</li>
      </ul>
      <p>兼容性：Chrome 57+, Firefox 52+, Safari 10.1+，无需 Polyfill。</p>
    `
  },
  {
    id: "4",
    title: "为什么我停止使用 console.log 调试？",
    date: "2024-02-20",
    excerpt: "从「打印派」到「断点派」，一次调试效率的质变。",
    content: `
      <p>过去我习惯在关键路径插入数十个 <code>console.log</code>，再靠眼力筛选有效信息。直到某次排查异步竞态问题耗时 4 小时……</p>
      <p>现在我的标准流程：</p>
      <ol>
        <li>用 <code>debugger</code> 触发 Chrome DevTools 断点；</li>
        <li>右键变量 → “Store as global variable” 快速复用；</li>
        <li>利用 <code>console.table(data)</code> 查看数组/对象结构；</li>
        <li>对异步链路，用 <code>async/await</code> + <code>try/catch</code> 显式捕获错误上下文。</li>
      </ol>
      <p>工具不会替代思考，但能放大思考的精度。</p>
    `
  },
  {
    id: "5",
    title: "给初学者的 Git 提交信息指南",
    date: "2024-01-10",
    excerpt: "一行标题 + 一段正文 + 一个关闭的 Issue —— 这就是专业协作的起点。",
    content: `
      <p>糟糕提交：<code>fix bug</code> ❌<br>
      优秀提交：<code>feat(api): add retry logic for /users endpoint</code> ✅</p>
      <p>遵循 Conventional Commits 规范：</p>
      <ul>
        <li><code>feat</code>：新增功能</li>
        <li><code>fix</code>：修复缺陷</li>
        <li><code>docs</code>：文档变更</li>
        <li><code>chore</code>：构建/CI/工具配置</li>
      </ul>
      <p>正文说明「为什么改」而非「改了什么」，例如：<br>
      <em>「因服务端偶发超时，前端增加 2 次自动重试，避免用户重复提交」</em></p>
    `
  }
];

// 路由控制
function renderView(hash) {
  // 隐藏所有视图
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  
  // 显示对应视图
  const viewId = hash ? `view-${hash.replace('#', '')}` : 'view-home';
  const targetView = document.getElementById(viewId);
  
  if (targetView) {
    targetView.classList.add('active');
    
    // 特殊处理：文章列表 / 文章详情
    if (hash === '#posts') {
      renderPostList();
    } else if (hash.startsWith('#post-')) {
      const id = hash.split('-')[1];
      renderPostDetail(id);
    }
  }
}

function renderPostList() {
  const container = document.getElementById('post-list');
  container.innerHTML = '';
  
  POSTS.forEach(post => {
    const el = document.createElement('article');
    el.className = 'post-item';
    el.innerHTML = `
      <h3><a href="#post-${post.id}">${post.title}</a></h3>
      <span class="meta">${post.date}</span>
      <p>${post.excerpt}</p>
    `;
    container.appendChild(el);
  });
}

function renderPostDetail(id) {
  const post = POSTS.find(p => p.id === id);
  if (!post) return;
  
  const container = document.getElementById('post-detail');
  container.innerHTML = `
    <h1>${post.title}</h1>
    <span class="meta">发布于 ${post.date}</span>
    ${post.content}
  `;
}

// 初始化 & 监听
document.addEventListener('DOMContentLoaded', () => {
  // 初始化路由
  const hash = window.location.hash || '#home';
  renderView(hash);

  // 监听哈希变化
  window.addEventListener('hashchange', () => {
    renderView(window.location.hash);
  });

  // 平滑滚动锚点（优化 UX）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      if (target === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      history.pushState(null, '', target);
      renderView(target);
    });
  });
});