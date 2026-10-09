const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Reduce padding on the "Ready to test your recall" block
const oldPadding = '<div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm">\n                  <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] dark:text-white mb-4">Ready to test your recall?</h2>';
const newPadding = '<div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-5 md:p-6 shadow-sm">\n                  <h2 className="text-xl md:text-2xl font-black text-[#1A1A1A] dark:text-white mb-4">Ready to test your recall?</h2>';
content = content.replace(oldPadding, newPadding);

// 2. Replace the toggle
const oldToggle = `<div className="flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-full relative w-full md:w-[60%] scale-95 md:scale-100 origin-left mb-6 border border-gray-200 dark:border-gray-800">
                    <div className="absolute top-1 bottom-1 w-[49%] bg-white dark:bg-[#333333] rounded-full shadow-sm transition-transform duration-300 ease-out" style={{ transform: practiceMode === 'normal' ? 'translateX(100%)' : 'translateX(0)' }}></div>
                    <button onClick={() => setPracticeMode('ranked')} className={\`flex-1 relative z-10 py-2.5 text-xs md:text-sm font-black tracking-wide rounded-full transition-colors \${practiceMode === 'ranked' ? 'text-[#1A1A1A] dark:text-white' : 'text-gray-400 dark:text-gray-500'}\`}>Ranked</button>
                    <button onClick={() => setPracticeMode('normal')} className={\`flex-1 relative z-10 py-2.5 text-xs md:text-sm font-black tracking-wide rounded-full transition-colors \${practiceMode === 'normal' ? 'text-[#1A1A1A] dark:text-white' : 'text-gray-400 dark:text-gray-500'}\`}>Normal</button>
                  </div>`;

const newToggle = `<div className="relative flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-full border border-[#E5E5E5] dark:border-gray-800 w-[240px] mb-6 transition-colors">
                    <div className="absolute top-1 bottom-1 w-[115px] bg-white dark:bg-gray-800 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out" style={{ transform: practiceMode === 'normal' ? 'translateX(117px)' : 'translateX(0)' }}></div>
                    <button type="button" onClick={() => setPracticeMode('ranked')} className={\`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-full transition-colors \${practiceMode === 'ranked' ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}\`}>Ranked</button>
                    <button type="button" onClick={() => setPracticeMode('normal')} className={\`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-full transition-colors \${practiceMode === 'normal' ? 'text-[#FF6B00]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'}\`}>Normal</button>
                  </div>`;

content = content.replace(oldToggle, newToggle);

fs.writeFileSync(file, content);
console.log('Dashboard ready to test section updated!');
