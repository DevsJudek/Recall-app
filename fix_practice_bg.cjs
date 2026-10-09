const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldClasses = `    : ['reading', 'practice_setup', 'quiz', 'share_topic', 'manage_courses'].includes(currentView)
      ? 'p-0 bg-white dark:bg-[#121212]'`;

const newClasses = `    : ['reading', 'quiz', 'share_topic', 'manage_courses'].includes(currentView)
      ? 'p-0 bg-white dark:bg-[#121212]'
      : currentView === 'practice_setup'
        ? 'p-0 bg-[#f8fafc] dark:bg-[#0a0a0a]'`;

content = content.replace(oldClasses, newClasses);

fs.writeFileSync(file, content);
console.log('App.jsx practice_setup background fixed!');
