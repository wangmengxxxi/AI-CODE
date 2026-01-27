let balance = 0;
const list = document.getElementById('list');
const balanceEl = document.getElementById('balance');

function add() {
  const input = document.getElementById('amount');
  const amt = parseFloat(input.value) || 0;
  if (amt === 0) return;
  balance += amt;
  balanceEl.textContent = balance.toFixed(2);
  const li = document.createElement('li');
  li.textContent = `${amt > 0 ? '收入' : '支出'}：¥${Math.abs(amt).toFixed(2)}`;
  list.insertBefore(li, list.firstChild);
  input.value = '';
}