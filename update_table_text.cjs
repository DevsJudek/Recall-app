const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldBlock = `                    {[
                      ['Access to Library', 'Limited', 'Unlimited'],
                      ['Daily Ranked Tests', '3 / day', 'Unlimited'],
                      ['High yield summaries', 'Limited', 'Full Access'],
                      ['Global Leaderboard', 'Included', 'Included'],
                      ['Performance Analytics', 'Basic', 'Advanced'],
                      ['Offline Mode', 'No', 'Yes']
                    ]`;

const newBlock = `                    {[
                      ['Access to Library', 'Unlimited', 'Unlimited'],
                      ['Daily Ranked Tests', '3 / day', 'Unlimited'],
                      ['Course notes', 'Limited', 'Full Access'],
                      ['Global Leaderboard', 'Included', 'Included'],
                      ['Performance Analytics', 'Basic', 'Advanced'],
                      ['Atlas AI Tutor', 'No', 'Yes']
                    ]`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(file, content);
console.log('Table details updated!');
