const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<span className="text-[#FF6B00]">premium tears</span>.',
  '<span className="text-[#FF6B00]">premium tears.</span>'
);

content = content.replace(
  '<span className="text-[#FF6B00]">you study</span>.',
  '<span className="text-[#FF6B00]">you study.</span>'
);

content = content.replace(
  '<span className="text-[#FF6B00]">lifesaver</span>.',
  '<span className="text-[#FF6B00]">lifesaver.</span>'
);

content = content.replace(
  '<span className="text-[#FF6B00]">Super Recall</span>.',
  '<span className="text-[#FF6B00]">Super Recall.</span>'
);

fs.writeFileSync(file, content);
console.log('Full stops moved inside orange spans!');
