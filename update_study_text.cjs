const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update Ecosystem Study text
content = content.replace(
  'Read through high yield summaries that cut out the noise and focus strictly on what is tested.',
  'Read through course notes that cut out the noise and focus strictly on what is tested.'
);

// Remove remaining hyphens in body text just to be safe
content = content.replace('university-level', 'university level');
content = content.replace('exam style', 'exam style'); // already removed
content = content.replace('high yield', 'high yield'); // already removed

fs.writeFileSync(file, content);
console.log('Ecosystem text and hyphens updated!');
