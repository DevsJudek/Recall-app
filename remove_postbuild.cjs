const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\package.json';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '"build": "vite build",\n    "postbuild": "node prerender.mjs",';
const newStr = '"build": "vite build",';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Removed postbuild script from package.json!');
} else {
    console.log('Could not find postbuild script in package.json.');
}
