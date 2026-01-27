const data = []; 
function add(){
  const d = document, desc = d.getElementById('desc').value.trim();
  const amt = parseFloat(d.getElementById('amt').value) || 0;
  const type = d.getElementById('type').value;
  if(!desc || !amt) return;
  data.push({desc,type,amt});
  render();
  d.getElementById('desc').value = '';
  d.getElementById('amt').value = '';
}
function render(){
  const list = document.getElementById('list');
  list.innerHTML = data.map((i,idx)=>
    `<div>${i.desc} ¥${i.amt} (${i.type}) <button onclick="data.splice(${idx},1);render()">×</button></div>`
  ).join('');
  const total = data.reduce((s,i)=>s+(i.type==='income'?i.amt:-i.amt),0);
  document.getElementById('total').textContent = `余额：¥${total.toFixed(2)}`;
}