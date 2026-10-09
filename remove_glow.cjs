const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove Hero Section Gradient
content = content.replace(
  '<div className="absolute inset-0 bg-gradient-to-b from-[#FF6B00]/10 to-transparent rounded-full blur-3xl opacity-50 -top-32 pointer-events-none"></div>',
  ''
);

// Remove Features Section Gradient
content = content.replace(
  '<div className="absolute inset-0 bg-[#FF6B00]/20 blur-[100px] rounded-full scale-110 pointer-events-none"></div>',
  ''
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
