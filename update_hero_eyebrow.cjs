const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="text-sm font-semibold tracking-wider text-[#FF6B00] uppercase mb-6"',
  'className="text-[15px] font-medium tracking-tight text-[#FF6B00] mb-6"'
);

fs.writeFileSync(file, content);
console.log('Hero eyebrow text updated!');
