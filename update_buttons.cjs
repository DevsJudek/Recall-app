const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Hero buttons
content = content.replace(
  'className="w-full sm:w-auto flex items-center justify-center bg-[#FF6B00] text-white px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-[#E56000] transition-colors shadow-lg"',
  'className="w-full sm:w-max flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-[#E56000] transition-colors shadow-sm"'
);

content = content.replace(
  'className="w-full sm:w-auto flex items-center justify-center bg-transparent text-[#FF6B00] px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-[#FF6B00]/10 transition-colors shadow-sm"',
  'className="w-full sm:w-max flex items-center justify-center gap-2 bg-transparent text-gray-700 dark:text-gray-300 px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"'
);

// Replace "Create your profile" in Mobile Companion Block
content = content.replace(
  'className="flex items-center justify-center bg-[#FF6B00] text-white px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-[#E56000] transition-colors shadow-lg w-max"',
  'className="w-max flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-[#E56000] transition-colors shadow-sm"'
);

// Replace bottom CTA button
content = content.replace(
  'className="flex items-center justify-center bg-[#FF6B00] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#E56000] transition-colors shadow-lg w-max border border-gray-200 dark:border-none"',
  'className="w-max flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-[#E56000] transition-colors shadow-sm"'
);

// Pricing and Topics buttons are already px-6 py-3 rounded-[14px] or [16px]. Let's ensure they use [14px] for consistency.
content = content.replace(
  'rounded-[16px] font-medium text-[15px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mt-8"',
  'rounded-[14px] font-medium text-[15px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mt-8 w-max"'
);

fs.writeFileSync(file, content);
console.log('Button standardization script completed successfully!');
