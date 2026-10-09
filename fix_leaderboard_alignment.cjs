const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Leaderboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const original = 'className="fixed bottom-[93px] md:bottom-[21px] left-0 w-full px-4 z-40 pointer-events-none"';
const fixed = 'className="fixed bottom-[93px] md:bottom-[21px] left-0 md:left-64 right-0 px-4 z-40 pointer-events-none"';

content = content.replace(original, fixed);

fs.writeFileSync(file, content);
console.log('Leaderboard bottom card alignment fixed!');
