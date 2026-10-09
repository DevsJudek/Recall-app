const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<img src="/mockups/leaderboard.png" alt="Leaderboard"',
  '<img src="/mockups/reading.png" alt="Reading"'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
