const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace all peach primary buttons with solid orange buttons
content = content.replace(/bg-\[#FFF2EC\] text-\[#0a0a0a\]/g, 'bg-[#FF6B00] text-white');

// Replace their hover states from white to a darker orange
content = content.replace(/hover:bg-white transition-colors/g, 'hover:bg-[#E56000] transition-colors');

// Also update the outline buttons to match the orange theme (solid orange or outline orange).
// Let's make "Explore the library" in Hero an outline orange button
content = content.replace(
  'bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-gray-100 dark:hover:bg-white/5',
  'bg-transparent border-2 border-[#FF6B00] text-[#FF6B00] px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-[#FF6B00]/10'
);

// Make "Explore Library" in Topics an outline orange button
content = content.replace(
  'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/5',
  'bg-transparent border border-[#FF6B00] text-[#FF6B00] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#FF6B00]/10'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
