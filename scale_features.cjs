const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove `py-12` from the Features image container
content = content.replace(
  '<div className="flex-1 w-full flex justify-center items-center relative py-12">',
  '<div className="flex-1 w-full flex justify-center items-center relative">'
);

// 2. Scale down the mockups from `w-64 md:w-80` to `w-56 md:w-64` (or similar smaller sizes)
content = content.replace(
  '<div className="relative w-64 md:w-80 flex items-center justify-center">',
  '<div className="relative w-48 md:w-64 flex items-center justify-center">'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
