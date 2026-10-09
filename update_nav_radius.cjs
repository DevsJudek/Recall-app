const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /(relative\s+)rounded-full(\s+backdrop-blur-lg\s+border)/;

if (regex.test(content)) {
  content = content.replace(regex, '$1rounded-[14px]$2');
  fs.writeFileSync(file, content);
  console.log('Navbar border radius updated to 14px!');
} else {
  console.log('Regex failed to match rounded-full.');
}
