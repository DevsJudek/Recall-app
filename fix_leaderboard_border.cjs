const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Leaderboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Restore the crown and rank logic
const currentBadge = `<div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#121212] flex items-center justify-center text-[10px] font-black text-gray-500 z-20 shadow-sm">{rank}</div>`;
const restoredBadges = `{isFirst && <div className="absolute -top-3 -right-2 text-2xl drop-shadow-md z-20">👑</div>}\n                  {!isFirst && <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#121212] flex items-center justify-center text-[10px] font-black text-gray-500 z-20 shadow-sm">{rank}</div>}`;

content = content.replace(currentBadge, restoredBadges);

// 2. Remove the orange border from the #1 avatar frame
const currentBorder = `className={\`z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 \${isFirst ? 'border-[#FF6B00]' : 'border-gray-200 dark:border-gray-800'} overflow-hidden shadow-sm flex items-center justify-center font-black text-white text-xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800\`}`;
const newBorder = `className="z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm flex items-center justify-center font-black text-white text-xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800"`;

content = content.replace(currentBorder, newBorder);

fs.writeFileSync(file, content);
console.log('Restored crown and standardized avatar border!');
