const posts = [
  { title: "初识前端", excerpt: "从 HTML 到交互逻辑，迈出开发第一步。", date: "2024-04-01" },
  { title: "CSS 布局心得", excerpt: "Flexbox 与 Grid 的实践对比与选择建议。", date: "2024-04-05" },
  { title: "JavaScript 闭包", excerpt: "理解闭包本质，避免内存泄漏陷阱。", date: "2024-04-10" }
];
const container = document.getElementById('posts');
container.innerHTML = posts.map(p => 
  `<article><h2>${p.title}</h2><time>${p.date}</time><p>${p.excerpt}</p></article>`
).join('');