const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change header max-width and make relative for absolute centering
content = content.replace(
  'className="flex justify-between items-center py-4 px-6 md:px-12 max-w-[1400px] mx-auto opacity-0 animate-hero-arrive"',
  'className="flex justify-between items-center py-4 px-6 md:px-12 max-w-[1200px] mx-auto opacity-0 animate-hero-arrive relative"'
);

// 2. Absolute center the nav links
content = content.replace(
  'className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600 dark:text-gray-300"',
  'className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600 dark:text-gray-300 absolute left-1/2 -translate-x-1/2"'
);

fs.writeFileSync(file, content);
console.log('Header alignment updated successfully!');
