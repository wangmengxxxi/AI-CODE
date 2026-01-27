let data = JSON.parse(localStorage.getItem('records')) || []; 
function add(){const d=document.getElementById('desc').value.trim();const a=+document.getElementById('amt').value;const t=document.getElementById('type').value;if(!d||!a)return;data.push({d,a,t});localStorage.setItem('records',JSON.stringify(data));render();}
function render(){const list=document.getElementById('list');list.innerHTML='';let bal=0;data.forEach(r=>{bal+=r.t==='in'?r.a:-r.a;list.innerHTML+=`<div>${r.d}: ${r.t==='in'?'+':'-'}${r.a}</div>`});document.getElementById('bal').textContent=bal;}
render();