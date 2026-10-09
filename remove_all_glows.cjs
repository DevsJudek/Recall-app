const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the custom orange glowing drop-shadows on the images
content = content.replace(/drop-shadow-\[0_30px_60px_rgba\(255,107,0,0\.3\)]/g, '');
content = content.replace(/drop-shadow-\[0_20px_50px_rgba\(0,0,0,0\.8\)]/g, '');
content = content.replace(/drop-shadow-2xl/g, '');

// 2. Remove the custom orange glowing box-shadows on buttons and cards
content = content.replace(/shadow-\[0_0_20px_rgba\(255,107,0,0\.2\)]/g, 'shadow-lg');
content = content.replace(/shadow-\[0_0_30px_rgba\(255,107,0,0\.2\)]/g, 'shadow-lg');
content = content.replace(/shadow-\[0_0_20px_rgba\(255,107,0,0\.1\)]/g, 'shadow-md');

// 3. Double check if there's any remaining blur blobs just in case
content = content.replace(/<div className="absolute inset-0 bg-gradient-to-b from-\[#FF6B00\]\/10 to-transparent rounded-full blur-3xl opacity-50 -top-32 pointer-events-none"><\/div>/g, '');
content = content.replace(/<div className="absolute inset-0 bg-\[#FF6B00\]\/20 blur-\[100px\] rounded-full scale-110 pointer-events-none"><\/div>/g, '');

fs.writeFileSync(file, content);
console.log('Shadows removed successfully!');
