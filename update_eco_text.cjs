const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldEcoText = 'A complete study ecosystem designed to cut out the fluff, save you from the night before panic, and help you secure your admission, grades, or professional license.';
const newEcoText = 'A complete study ecosystem designed to cut out the fluff and save you from the night before panic. Scattered handouts, missing PDFs, and unorganized Google Drive links are now a thing of the past.';

content = content.replace(oldEcoText, newEcoText);

fs.writeFileSync(file, content);
console.log('Ecosystem paragraph updated!');
