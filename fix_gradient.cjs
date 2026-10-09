const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div className="absolute bottom-[-10px] left-[-20px] right-[-20px] h-48 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/80 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80 to-transparent pointer-events-none transform md:rotate-[-5deg]"></div>',
  '<div className="absolute bottom-[-20px] left-[-20px] right-[-20px] h-[60%] bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/95 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/95 to-transparent pointer-events-none transform md:rotate-[-5deg]"></div>'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
