const fs = require('fs');

// Patch App.jsx
const appFile = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let appContent = fs.readFileSync(appFile, 'utf8');

const appOrigRule = `      // Filter enrolled courses so a 200L student never has 300L+ courses in their active list!
      const validEnrolled = enrolledCourses.filter(code => {
        const c = coursesList.find(x => x.code === code);
        if (!c) return true;
        const cLvlNum = parseInt(c.level, 10) || 0;
        if (userLevelNum > 0 && cLvlNum > userLevelNum) return false;
        return true;
      });`;

const appNewRule = `      // Strict filter: Students can ONLY see courses specifically for their current level.
      const validEnrolled = enrolledCourses.filter(code => {
        const c = coursesList.find(x => x.code === code);
        if (!c) return true;
        return c.level === level;
      });`;

if (appContent.includes(appOrigRule.split('\\n')[0])) {
    const startIdx = appContent.indexOf('      // Filter enrolled courses');
    const endIdx = appContent.indexOf('});', startIdx) + 3;
    appContent = appContent.substring(0, startIdx) + appNewRule + appContent.substring(endIdx);
    fs.writeFileSync(appFile, appContent);
    console.log('App.jsx patched.');
}

// Patch ManageCourses.jsx
const manageFile = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\ManageCourses.jsx';
let manageContent = fs.readFileSync(manageFile, 'utf8');

const manageOrigRule = `              // dYs ABSOLUTE RULE: A student can NEVER see ANY course of a higher level (300L/400L/500L for 200L)!
              if (userLevelNum > 0 && courseLevelNum > userLevelNum) {
                  return false;
              }`;
const manageNewRule = `              // STRICT RULE: A student ONLY sees courses for their current level!
              if (course.level !== level) {
                  return false;
              }`;

if (manageContent.includes('userLevelNum > 0 && courseLevelNum > userLevelNum')) {
    const startIdx = manageContent.indexOf('              // dYs ABSOLUTE RULE');
    const endIdx = manageContent.indexOf('}', startIdx) + 1;
    manageContent = manageContent.substring(0, startIdx) + manageNewRule + manageContent.substring(endIdx);
    fs.writeFileSync(manageFile, manageContent);
    console.log('ManageCourses.jsx patched.');
}
