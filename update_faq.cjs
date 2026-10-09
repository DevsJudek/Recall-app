const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldFaqStart = '<section className="max-w-3xl mx-auto space-y-6">';

content = content.replace(
  oldFaqStart,
  '<section className="max-w-5xl mx-auto mt-32 mb-16 space-y-6">'
);

fs.writeFileSync(file, content);
console.log('FAQ alignment updated!');
