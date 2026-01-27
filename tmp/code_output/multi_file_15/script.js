const courses = [
  ['08:00', '数学', '英语', '物理', '化学', '生物'],
  ['09:00', '英语', '数学', '语文', '英语', '数学'],
  ['10:00', '语文', '物理', '英语', '数学', '语文'],
  ['11:00', '体育', '化学', '生物', '语文', '体育']
];

document.getElementById('table-body').innerHTML = courses.map(row =>
  `<tr><td><strong>${row[0]}</strong></td>` +
  row.slice(1).map(cell => `<td>${cell}</td>`).join('') +
  '</tr>'
).join('');