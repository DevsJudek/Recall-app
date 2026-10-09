const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /:\s*\['reading',\s*'practice_setup',\s*'quiz',\s*'share_topic',\s*'manage_courses'\]\.includes\(currentView\)\s*\?\s*'p-0\s*bg-white\s*dark:bg-\[\#121212\]'/;

const replacement = `: ['reading', 'quiz', 'share_topic', 'manage_courses'].includes(currentView)
      ? 'p-0 bg-white dark:bg-[#121212]'
      : currentView === 'practice_setup'
        ? 'p-0 bg-[#f8fafc] dark:bg-[#0a0a0a]'`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Patch successfully applied to App.jsx!');
} else {
    console.log('Could not find the target string in App.jsx to replace.');
}
