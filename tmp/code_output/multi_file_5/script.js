const db = JSON.parse(localStorage.getItem('ledger')||'[]'); 
const render = () => { 
  const list = document.getElementById('list'); 
  list.innerHTML = db.map((i, idx) => `<div>${i.desc} ¥${i.amt} <small>(${i.type==='in'?'↑':'↓'})</small> <button onclick="del(${idx})">×</button></div>`).join(''); 
  const sum = db.reduce((s,i) => s + (i.type==='in' ? i.amt : -i.amt), 0); 
  document.querySelector('#total span').textContent = sum.toFixed(2); 
  localStorage.setItem('ledger', JSON.stringify(db)); 
}; 
const add = () => { 
  const d = document, desc = d.getElementById('desc').value.trim(), amt = +d.getElementById('amt').value; 
  if (desc && !isNaN(amt) && amt !== 0) { 
    db.push({ desc, amt, type: d.getElementById('type').value, time: new Date().toISOString() }); 
    d.getElementById('desc').value = d.getElementById('amt').value = ''; 
  } 
}; 
const del = i => db.splice(i, 1); 
render();