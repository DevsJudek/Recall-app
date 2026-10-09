const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] max-w-md">Find courses by what you study.</h2>',
  '<h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] max-w-lg">Recall is available for Law, Agriculture, Sciences, etc.</h2>'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
