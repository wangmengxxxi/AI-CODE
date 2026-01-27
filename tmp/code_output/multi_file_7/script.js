// script.js
let data = [];
const add = () => {
  const d = document, desc = d.getElementById('desc').value.trim();
  const amt = parseFloat(d.getElementById('amt').value) || 0;
  if (!desc || !amt) return;
  const type = d.getElementById('type').value;
  data.push({ desc, amt, type, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) });
  render();
  d.getElementById('desc').value = d.getElementById('amt').value = '';
};
const render = () => {
  const list = document.getElementById('list');
  list.innerHTML = data.map(i => `<div>[${i.time}] ${i.desc} ¥${i.amt} <small>(${i.type})</small></div>`).join('');
  const income = data.filter(i => i.type === 'income').reduce((s,i) => s + i.amt, 0);
  const expense = data.filter(i => i.type === 'expense').reduce((s,i) => s + i.amt, 0);
  document.getElementById('summary').textContent =
    `余额: ¥${(income - expense).toFixed(2)} | 收入: ¥${income.toFixed(2)} | 支出: ¥${expense.toFixed(2)}`;
};