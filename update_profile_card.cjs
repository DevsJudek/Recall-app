const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the card background
content = content.replace(
  'overflow-hidden rounded-[24px] bg-[#f8f9fa] dark:bg-[#0a0a0a] p-6 md:p-8 shadow-sm',
  'overflow-hidden rounded-[24px] bg-[#0a0a0a] p-6 md:p-8 shadow-lg'
);

// Replace the Super Recall header logic
content = content.replace(
  '<h3 className="text-2xl md:text-3xl font-black tracking-tight text-[#1A1A1A] dark:text-white mb-2">Super Recall</h3>',
  '<h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-3">Super Recall <span className="text-[10px] md:text-xs font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded-md uppercase">BETA</span></h3>'
);

// Make the text always white/gray-400
content = content.replace(
  '<p className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400">',
  '<p className="text-sm md:text-base font-medium text-gray-400">'
);

fs.writeFileSync(file, content);
console.log('Profile card styling updated!');
