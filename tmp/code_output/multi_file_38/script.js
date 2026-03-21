// ✅ 替换原脆弱写法（new Date().toISOString().split('T')[0]）
// ❌ 问题：IE 不支持 toISOString()；split 可能因时区异常出错
// ✅ 改为手动拼接，padStart 保障两位数（ES2017+，IE11 需 polyfill，但已覆盖主流环境）
const now = new Date();
const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
document.getElementById('post-date').textContent = dateStr;