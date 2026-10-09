const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<button onClick=\{onLoginClick\} className="w-full sm:w-max flex items-center justify-center gap-2 bg-transparent text-gray-700 dark:text-gray-300 px-6 py-3 rounded-\[14px\] font-medium text-\[15px\] hover:bg-gray-100 dark:hover:bg-white\/5 transition-colors">\s*Explore the library\s*<\/button>/m;

if (regex.test(content)) {
  content = content.replace(regex, '');
  fs.writeFileSync(file, content);
  console.log('Second CTA removed!');
} else {
  console.log('Regex failed to match second CTA.');
}
