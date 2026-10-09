const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\AdminDashboard.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Delete lines 630-646 (0-indexed 630-646 is line 631-647)
lines.splice(630, 17);

fs.writeFileSync(file, lines.join('\n'));
console.log('AdminDashboard.jsx fixed!');
