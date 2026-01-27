let data = JSON.parse(localStorage.getItem('records')) || [];
const render = () => {
  const list = document.getElementById('list');
  list.innerHTML = data.map((r, i) => `<li>${r.desc}：${r.type === 'income' ? '+' : '-'}¥${r.amt} <button onclick="del(${i})">×</button></li>`).join('');
  const balance = data.reduce((s, r) => s + (r.type === 'income' ? r.amt : -r.amt), 0);
  document.getElementById('balance').textContent = balance.toFixed(2);
};
const add = () => {
  const desc = document.getElementById('desc').value.trim();
  const amt = parseFloat(document.getElementById('amt').value);
  if (desc && !isNaN(amt) && amt !== 0) {
    data.push({ desc, amt, type: document.getElementById('type').value, time: new Date().toISOString() });
    localStorage.setItem('records', JSON.stringify(data));
    document.getElementById('desc').value = '';
    document.getElementById('amt').value = '';
  }
};
const del = (i) => { data.splice(i, 1); localStorage.setItem('records', JSON.stringify(data)); };
render();