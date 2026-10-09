const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\PracticeSetup.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix Ranked Mode
content = content.replace(
    '<div className="flex flex-col items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 mt-auto w-full">',
    '<div className="mt-auto w-full flex flex-col justify-end h-full"><div className="flex flex-col items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 w-full">'
);
content = content.replace(
    'Start Ranked Test →\n                            </button>',
    'Start Ranked Test →\n                            </button>\n                            </div>'
);

// Fix Normal Mode
content = content.replace(
    '<div className="flex flex-col items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 mt-auto w-full">',
    '<div className="mt-auto w-full flex flex-col justify-end h-full"><div className="flex flex-col items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 w-full">'
);
content = content.replace(
    'Start Normal Test →\n                            </button>',
    'Start Normal Test →\n                            </button>\n                            </div>'
);

// Fix Custom Room
content = content.replace(
    '<div className="flex items-center justify-center w-full text-xs font-bold text-gray-400 dark:text-gray-500 mb-5 mt-auto">',
    '<div className="mt-auto w-full flex flex-col justify-end h-full"><div className="flex items-center justify-center w-full text-xs font-bold text-gray-400 dark:text-gray-500 mb-5">'
);
// Need to add a spacer in Custom room to match the Course Selection box height (~76px)
content = content.replace(
    'Coming Soon 🔒\n                            </button>',
    'Coming Soon 🔒\n                            </button>\n                            </div>'
);
content = content.replace(
    '<button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-[14px] font-bold text-sm border border-gray-200 dark:border-gray-700 cursor-not-allowed flex items-center justify-center gap-2 mt-auto">',
    '<div className="w-full h-[68px] mb-4 invisible" aria-hidden="true"></div>\n                              <button disabled className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-[14px] font-bold text-sm border border-gray-200 dark:border-gray-700 cursor-not-allowed flex items-center justify-center gap-2 mt-auto">'
);

fs.writeFileSync(file, content);
console.log('PracticeSetup alignment fixed!');
