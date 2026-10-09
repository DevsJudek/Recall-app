const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix the tag mismatch
content = content.replace(
  '<div className="p-10 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#1a1a1a] flex flex-col h-full relative border-none">',
  '<CardSpotlight className="p-10 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#1a1a1a] flex flex-col h-full relative border border-gray-200 dark:border-white/5">'
);

// We need to add relative z-20 to the children so they sit on top of the spotlight
// We can just add relative z-20 to all direct children of the CardSpotlight.
// But it's easier to just do it manually with regex.
content = content.replace(
  '<div className="flex items-center justify-between mb-8">',
  '<div className="flex items-center justify-between mb-8 relative z-20">'
);
content = content.replace(
  '<div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2">',
  '<div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2 relative z-20">'
);
content = content.replace(
  '<div className="text-[14px] font-medium text-gray-500 mb-6">Per semester</div>',
  '<div className="text-[14px] font-medium text-gray-500 mb-6 relative z-20">Per semester</div>'
);
content = content.replace(
  '<div className="text-[14px] leading-[1.6] text-gray-600 dark:text-gray-400 mb-10 max-w-[280px]">Unlimited practice, deep explanations, offline mode, and zero restrictions.</div>',
  '<div className="text-[14px] leading-[1.6] text-gray-600 dark:text-gray-400 mb-10 max-w-[280px] relative z-20">Unlimited practice, deep explanations, offline mode, and zero restrictions.</div>'
);
content = content.replace(
  '<ul className="space-y-4 mb-20 flex-1">',
  '<ul className="space-y-4 mb-20 flex-1 relative z-20">'
);
content = content.replace(
  '<button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-[12px] font-medium text-[14px] hover:bg-[#E56000] transition-colors shadow-sm mt-auto">',
  '<button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-[12px] font-medium text-[14px] hover:bg-[#E56000] transition-colors shadow-sm mt-auto relative z-20">'
);
content = content.replace(
  '<p className="mt-5 text-[12px] text-gray-500 dark:text-gray-500 max-w-[250px] leading-relaxed">',
  '<p className="mt-5 text-[12px] text-gray-500 dark:text-gray-500 max-w-[250px] leading-relaxed relative z-20">'
);

fs.writeFileSync(file, content);
console.log('Fixed syntax error in LandingPage.jsx');
