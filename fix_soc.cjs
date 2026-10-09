const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "['PHL 319', 'PUB 301'].includes(code)",
  "['PHL 319', 'PUB 301', 'SOC 201'].includes(code)"
);

content = content.replace(
  "['PHL 320', 'PUB 302'].includes(code)",
  "['PHL 320', 'PUB 302', 'SOC 202'].includes(code)"
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
