const COURSE_DATA = [
  ["数学", "英语", "物理", "化学", "体育"],
  ["语文", "数学", "英语", "生物", "美术"],
  ["英语", "物理", "语文", "数学", "音乐"],
  ["化学", "体育", "数学", "英语", "信息技术"],
  ["班会", "语文", "化学", "物理", "英语"],
  ["自习", "自习", "自习", "自习", "自习"]
];
const PERIODS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"];

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#schedule tbody");
  if (!tbody) return;
  tbody.innerHTML = PERIODS.map((t, i) => 
    `<tr><th scope="row"><time datetime="${t}">${t}</time></th>${COURSE_DATA[i]?.map(c => `<td>${c || ""}</td>`).join("")}</tr>`
  ).join("");
});