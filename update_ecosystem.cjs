const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update icon containers (remove borders, solid dark bg, slightly larger)
content = content.replace(
  /className="w-12 h-12 rounded-xl bg-white dark:bg-\[#1A1412\] border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6"/g,
  'className="w-[52px] h-[52px] rounded-[16px] bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center mb-6"'
);

// Update titles
content = content.replace(
  /className="text-xl font-bold mb-4 text-gray-900 dark:text-white"/g,
  'className="text-[22px] font-semibold tracking-[-0.01em] mb-3 text-gray-900 dark:text-white"'
);

// Update descriptions
content = content.replace(
  /className="text-gray-600 dark:text-gray-400 leading-relaxed"/g,
  'className="text-[15px] text-gray-600 dark:text-gray-400 leading-[1.6]"'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
