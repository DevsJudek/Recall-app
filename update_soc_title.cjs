const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = "{ code: 'SOC 201', title: 'Sociology I'";
const newStr = "{ code: 'SOC 201', title: 'Introduction to Sociology I'";

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Updated SOC 201 title in App.jsx!');
} else {
    console.log('Could not find SOC 201 fallback string.');
}
