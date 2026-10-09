const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'perspective-1000 overflow-hidden md:overflow-visible"',
  'perspective-1000"'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
