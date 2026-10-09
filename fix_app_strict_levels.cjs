const fs = require('fs');
const appFile = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let appContent = fs.readFileSync(appFile, 'utf8');

const regex = /\/\/\s*Filter enrolled courses so a 200L student never has 300L\+ courses in their active list![\s\S]*?return true;\s*\}\);/g;

const appNewRule = `// Strict filter: Students can ONLY see courses specifically for their current level.
      const validEnrolled = enrolledCourses.filter(code => {
        const c = coursesList.find(x => x.code === code);
        if (!c) return true;
        return c.level === level;
      });`;

if (regex.test(appContent)) {
    appContent = appContent.replace(regex, appNewRule);
    fs.writeFileSync(appFile, appContent);
    console.log('App.jsx patched perfectly!');
} else {
    console.log('Regex did not match.');
}
