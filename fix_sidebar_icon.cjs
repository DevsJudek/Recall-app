const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\components\\Sidebar.jsx';
let content = fs.readFileSync(file, 'utf8');

// Use regex to match the avatar div block
const regex = /<div className="w-6 h-6 rounded-full bg-gray-200[\s\S]*?<\/div>/;
const replacement = `<span className="text-xl">👤</span>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Sidebar profile icon updated successfully.');
} else {
    console.log('Regex did not match.');
}
