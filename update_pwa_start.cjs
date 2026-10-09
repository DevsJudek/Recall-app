const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\public\\manifest.json';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '"start_url": ".",';
const newStr = '"start_url": "/app.html",';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Updated manifest.json start_url to /app.html!');
} else {
    console.log('Could not find start_url string.');
}
