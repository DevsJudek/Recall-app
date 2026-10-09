const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ['hyper-tailored', 'hyper tailored'],
  ['off-point', 'off point'],
  ['exam-style', 'exam style'],
  ['high-yield', 'high yield'],
  ['bite-sized', 'bite sized'],
  ['500-page', '500 page'],
  ['night-before', 'night before'],
  ['exam-week', 'exam week']
];

let updatedCount = 0;
for (const [search, replace] of replacements) {
  // Global replace but avoiding html tags just in case, though these words only appear in text
  const regex = new RegExp(search, 'g');
  if (regex.test(content)) {
    content = content.replace(regex, replace);
    updatedCount++;
  }
}

fs.writeFileSync(file, content);
console.log(`Updated ${updatedCount} hyphenated words successfully!`);
