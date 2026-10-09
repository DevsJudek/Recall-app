const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Hero Left Phone
content = content.replace(
  '<div className="absolute left-[-20px] sm:left-0 md:left-[10%] top-8 md:top-12 w-32 sm:w-48 md:w-64 transform -rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-10">',
  '<div className="absolute left-[-20px] sm:left-0 md:left-[10%] top-8 md:top-12 w-32 sm:w-48 md:w-64 transform -rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-10 animate-float-breathe-delayed">'
);

// 2. Hero Center Phone
content = content.replace(
  '<div className="absolute left-1/2 -translate-x-1/2 top-0 w-44 sm:w-64 md:w-80 transform hover:-translate-y-6 transition-transform duration-700 z-30">',
  '<div className="absolute left-1/2 -translate-x-1/2 top-0 w-44 sm:w-64 md:w-80 transform hover:-translate-y-6 transition-transform duration-700 z-30 animate-float-breathe">'
);

// 3. Hero Right Phone
content = content.replace(
  '<div className="absolute right-[-20px] sm:right-0 md:right-[10%] top-16 md:top-24 w-32 sm:w-48 md:w-64 transform rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-20">',
  '<div className="absolute right-[-20px] sm:right-0 md:right-[10%] top-16 md:top-24 w-32 sm:w-48 md:w-64 transform rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 z-20 animate-float-breathe-slow">'
);

// 4. Pocket Companion Phone
content = content.replace(
  '<div className="relative w-full max-w-[450px]">',
  '<div className="relative w-full max-w-[450px] animate-float-breathe-slow">'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
