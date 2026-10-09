const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Reading.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = 'className={`fixed bottom-28 md:bottom-10 right-6 z-40 rounded-full';
const newStr = 'className={`fixed bottom-27 md:bottom-10 right-6 z-40 rounded-full';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Fixed Fluid Orb position!');
} else {
    console.log('Could not find Fluid Orb target string.');
}
