const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Use regex to remove the span rendering the active course code from the header
const regex = /<span className="text-\[10px\] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden sm:inline">\{activeCourse\?\.code \|\| 'RECALL'\}<\/span>\r?\n\s*/g;

content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log('Course code removed from navbar!');
