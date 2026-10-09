const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<main className="max-w-[1200px] mx-auto px-6 md:px-12 pt-32 pb-24 space-y-40">',
  '<main className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 pb-24 space-y-40">'
);

content = content.replace(
  '<section className="flex flex-col items-center text-center mt-12 md:mt-24">',
  '<section className="flex flex-col items-center text-center mt-8">'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
