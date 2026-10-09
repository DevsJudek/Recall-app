const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\components\\Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the "updating your profile" tip
content = content.replace(/<div className="p-4 bg-\[#FFF9F5\][\s\S]*?<\/div>/, '');

// 2. Fix the profile icon to match the mobile emoji logic
const oldProfileIcon = `<div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-[#E5E5E5] dark:border-gray-600">
                            <img src="https://i.pravatar.cc/150?u=judek" alt="Avatar" className="w-full h-full object-cover" />
                        </div>`;
const newProfileIcon = `<span className="text-xl">👤</span>`;
content = content.replace(oldProfileIcon, newProfileIcon);

fs.writeFileSync(file, content);
console.log('Sidebar.jsx updated (removed tip, fixed profile icon).');
