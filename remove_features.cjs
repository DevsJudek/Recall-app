const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '{/* FEATURES INTERACTIVE SECTION */}';
const endMarker = '{/* TOPICS SECTION */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const sectionToRemove = content.substring(startIndex, endIndex);
  content = content.replace(sectionToRemove, '');
  fs.writeFileSync(file, content);
  console.log('Removed features interactive section successfully!');
} else {
  console.log('Could not find markers.');
}
