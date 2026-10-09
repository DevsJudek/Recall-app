const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Reduce padding of the inner subscription card
// `p-5 md:p-6` -> `p-4 md:p-5`
content = content.replace(
    'className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[24px] bg-[#0a0a0a] p-5 md:p-6 shadow-lg"',
    'className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[24px] bg-[#0a0a0a] p-4 md:p-5 shadow-lg"'
);

// 2. Scale down the BETA icon on mobile
// original: <h3 className="... gap-3">Super Recall <span className="text-[10px] md:text-xs font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded-md uppercase">BETA</span></h3>
const origTitle = '<h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-3">Super Recall <span className="text-[10px] md:text-xs font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded-md uppercase">BETA</span></h3>';
const newTitle = '<h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-2 md:gap-3">Super Recall <span className="text-[8px] md:text-xs font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md uppercase mt-0.5 md:mt-0">BETA</span></h3>';

if (content.includes(origTitle)) {
    content = content.replace(origTitle, newTitle);
} else {
    // try regex if line endings messed up
    const regex = /<h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-3">\s*Super Recall\s*<span className="text-\[10px\] md:text-xs font-black tracking-widest text-blue-400 bg-blue-500\/10 border border-blue-500\/30 px-2 py-1 rounded-md uppercase">\s*BETA\s*<\/span>\s*<\/h3>/g;
    content = content.replace(regex, newTitle);
}

fs.writeFileSync(file, content);
console.log('Profile tweaks applied!');
