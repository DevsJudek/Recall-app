const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '<div className="min-h-screen w-full overflow-x-hidden';
const newStr = '<div className="relative min-h-screen w-full overflow-x-hidden';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Fixed wrapper overflow!');
} else {
    console.log('Target string not found.');
}
