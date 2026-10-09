const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\package.json';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '"build": "vite build",';
const newStr = '"build": "vite build",\n    "postbuild": "node prerender.mjs",';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Added postbuild script to package.json!');
} else {
    console.log('Could not find build script in package.json.');
}
