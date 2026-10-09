const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Leaderboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// The original strings (with unicode crown emoji)
const crownLine = `{isFirst && <div className="absolute -top-3 -right-2 text-2xl drop-shadow-md z-20">👑</div>}`;
const otherLine = `{!isFirst && <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#121212] flex items-center justify-center text-[10px] font-black text-gray-500 z-20 shadow-sm">{rank}</div>}`;

// We will use regex to find both and replace them with just the grey circle for all ranks
const regex = /\{isFirst && <div className="absolute -top-3 -right-2 text-2xl drop-shadow-md z-20">.*?<\/div>\}\s*\{!isFirst && <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-\[#121212\] flex items-center justify-center text-\[10px\] font-black text-gray-500 z-20 shadow-sm">\{rank\}<\/div>\}/g;

const replacement = `<div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-[#121212] flex items-center justify-center text-[10px] font-black text-gray-500 z-20 shadow-sm">{rank}</div>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Leaderboard rank icon standardized!');
} else {
    // Try fallback regex in case the terminal emoji logging got weird
    const fallbackRegex = /\{isFirst &&.*?z-20">.*?<\/div>\}\s*\{!isFirst &&.*?\{rank\}<\/div>\}/g;
    if (fallbackRegex.test(content)) {
        content = content.replace(fallbackRegex, replacement);
        fs.writeFileSync(file, content);
        console.log('Leaderboard rank icon standardized using fallback regex!');
    } else {
        console.log('Regex did not match at all.');
    }
}
