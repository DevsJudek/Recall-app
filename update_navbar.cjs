const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldHeaderRegex = /<header className=\{\`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 \$\{scrolled \? 'bg-white\/90 dark:bg-\[#0a0a0a\]\/90 backdrop-blur-md border-b border-gray-200 dark:border-white\/5' : 'bg-transparent'\}\`\}>\s*<div className="flex justify-between items-center py-4 px-6 md:px-12 max-w-\[1200px\] mx-auto opacity-0 animate-hero-arrive relative">/m;

const newHeader = `<header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1100px] px-4 transition-all duration-300">
        <div className={\`flex justify-between items-center py-3 px-6 md:px-8 mx-auto opacity-0 animate-hero-arrive relative rounded-full backdrop-blur-lg border transition-all duration-300 \${scrolled ? 'bg-white/70 dark:bg-black/40 border-gray-200/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'bg-white/40 dark:bg-black/20 border-white/20 dark:border-white/5 shadow-lg'}\`}>`;

if (oldHeaderRegex.test(content)) {
  content = content.replace(oldHeaderRegex, newHeader);
  fs.writeFileSync(file, content);
  console.log('Navbar updated to floating glassmorphic pill!');
} else {
  console.log('Regex failed to match the old header.');
}
