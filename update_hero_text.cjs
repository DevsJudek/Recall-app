const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'Interactive Study & Quiz Platform',
  'Recall Beta is Live'
);

// If I changed it to title case earlier, let me just use regex for safety:
content = content.replace(/Interactive Study & Quiz Platform/gi, 'Recall Beta is Live');

fs.writeFileSync(file, content);
console.log('Hero eyebrow text updated!');
