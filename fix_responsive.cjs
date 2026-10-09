const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="flex flex-col xl:flex-row items-center justify-between gap-16 mt-32 relative"',
  'className="flex flex-col md:flex-row items-center justify-between gap-16 mt-32 relative"'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
