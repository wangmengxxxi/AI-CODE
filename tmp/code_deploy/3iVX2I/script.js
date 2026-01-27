let expr = '';
const disp = document.getElementById('display');

function input(val) {
  if (val === 'C') expr = '';
  else if (expr === 'Error') expr = '';
  else expr += val;
  disp.value = expr || '0';
}

function calculate() {
  try {
    expr = String(eval(expr.replace(/×/g, '*').replace(/÷/g, '/')));
  } catch {
    expr = 'Error';
  }
  disp.value = expr;
}