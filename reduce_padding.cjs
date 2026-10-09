const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

// Reduce outer padding
content = content.replace(
  'p-2 md:p-3',
  'p-1 md:p-1.5'
);

// Reduce inner padding
content = content.replace(
  'p-6 md:p-8 shadow-lg',
  'p-5 md:p-6 shadow-lg'
);

fs.writeFileSync(file, content);
console.log('Paddings reduced in Profile card!');
