const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldCode = '<p className="text-[15px] font-medium tracking-tight text-[#FF6B00] mb-6">Recall Beta is Live</p>';
const newCode = `<div className="flex justify-center items-center gap-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00] shadow-[0_0_8px_#FF6B00]"></span>
                </span>
                <p className="text-[15px] font-medium tracking-tight text-[#FF6B00]">Recall Beta is Live</p>
              </div>`;

content = content.replace(oldCode, newCode);

fs.writeFileSync(file, content);
console.log('Glowing dot added!');
