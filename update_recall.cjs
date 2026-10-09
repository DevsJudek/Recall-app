const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Change Recall Plus to Super Recall
content = content.replace(/>Recall Plus<\/th>/g, '>Super Recall</th>');
content = content.replace(/upgrade to Recall Plus\./g, 'upgrade to Super Recall.');
content = content.replace(/Recall Plus members\./g, 'Super Recall members.');
content = content.replace(/or get Plus for/g, 'or get Super Recall for');
content = content.replace(/Unlock Plus\./g, 'Unlock Super Recall.');

// 2. Scale up the footer Recall text
content = content.replace(
  '<h1 className="text-[15vw] font-bold leading-none tracking-tighter text-[#FF6B00]/10 select-none">Recall</h1>',
  '<h1 className="text-[25vw] font-bold leading-none tracking-tighter text-[#FF6B00]/10 select-none">Recall</h1>'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
