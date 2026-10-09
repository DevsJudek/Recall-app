const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldText = 'Climb the ranks on the localized leaderboard and secure your bragging rights.';
const newText = 'Climb the ranks on the localized leaderboard, secure bragging rights, and challenge course mates to private rooms.';

content = content.replace(oldText, newText);

fs.writeFileSync(file, content);
console.log('Compete text updated!');
