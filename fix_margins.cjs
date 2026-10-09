const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix main space-y
content = content.replace(
  'className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 pb-24 space-y-40"',
  'className="max-w-[1200px] mx-auto px-6 md:px-12 pt-24 pb-24 space-y-24 md:space-y-32"'
);

// 2. Remove pt-24 mt-24 from features
content = content.replace(
  '<section id="features" className="flex flex-col xl:flex-row gap-16 items-center pt-24 mt-24">',
  '<section id="features" className="flex flex-col xl:flex-row gap-16 items-center">'
);

// 3. Remove mt-40 from pricing
content = content.replace(
  '<section id="pricing" className="mt-40 max-w-4xl mx-auto">',
  '<section id="pricing" className="max-w-4xl mx-auto">'
);

// 4. Remove mt-32 from FAQ
content = content.replace(
  '<section className="mt-32 max-w-3xl mx-auto space-y-6">',
  '<section className="max-w-3xl mx-auto space-y-6">'
);

// 5. Remove mt-40 from closing CTA
content = content.replace(
  '<section className="mt-40 mb-16 flex flex-col items-center text-center">',
  '<section className="mb-16 flex flex-col items-center text-center">'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
