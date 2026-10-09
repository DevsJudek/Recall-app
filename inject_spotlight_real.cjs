const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\*\s*HEADER\s*\*\/\}/i;

if (regex.test(content)) {
  content = content.replace(regex, '{/* SPOTLIGHT */}\n        <div className="hidden dark:block"><Spotlight /></div>\n\n        {/* HEADER */}');
  fs.writeFileSync(file, content);
  console.log('Spotlight finally injected into LandingPage.jsx!');
} else {
  console.log('Regex failed to match HEADER comment.');
}
