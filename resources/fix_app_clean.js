const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app.js');
let content = fs.readFileSync(filePath, 'utf8');

// Remove stray `];` before `Kỉa noỏc Chướng Lấm`
content = content.replace('];Kỉa noỏc Chướng Lấm', 'Kỉa noỏc Chướng Lấm');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned stray ]; in app.js!');
