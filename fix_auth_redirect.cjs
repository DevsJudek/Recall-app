const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Auth.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/redirectTo: window\.location\.origin/g, 'redirectTo: window.location.origin + "/app.html"');

fs.writeFileSync(file, content);
console.log('Fixed OAuth redirect URI in Auth.jsx to point to /app.html!');
