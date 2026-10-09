const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\ManageCourses.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = 'className="fixed bottom-[92px] md:bottom-8 left-0 right-0 z-50 pointer-events-none px-4 flex justify-center pb-safe"';
const newStr = 'className="fixed bottom-[92px] md:bottom-8 left-0 md:left-64 right-0 z-50 pointer-events-none px-4 flex justify-center pb-safe"';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Fixed ManageCourses fixed footer alignment!');
} else {
    console.log('Could not find the target string. Maybe the class names changed?');
}
