const posts = [
  { title: "初识前端", time: "2024-04-01" },
  { title: "CSS 布局心得", time: "2024-04-05" }
];
const html = posts.map(p => 
  `<article><h2>${p.title}</h2><div class="time">${p.time}</div></article>`
).join('');
document.getElementById('posts').innerHTML = html;