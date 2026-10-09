const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\ManageCourses.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the old strict type-based filtering logic
const startFilter = content.indexOf('// 1. Electives (Core and Restricted)');
const endFilter = content.indexOf('return true;', startFilter);

if (startFilter !== -1 && endFilter !== -1) {
    content = content.substring(0, startFilter) + content.substring(endFilter);
}

// 2. Update the groupedCourses logic
const startIndex = content.indexOf('const groupedCourses = {');
const endIndex = content.indexOf('};', startIndex) + 2;

const newGroup = `const groupedCourses = {
        'Core Electives': filteredCourses.filter(c => c.type === 'Core' && parseLevelNum(c.level) === userLevelNum),
        'Restricted Electives': filteredCourses.filter(c => c.type === 'Restricted' && parseLevelNum(c.level) === userLevelNum),
        'Special Electives': filteredCourses.filter(c => c.type === 'Special Elective' && parseLevelNum(c.level) === userLevelNum),
        'Carryovers': filteredCourses.filter(c => parseLevelNum(c.level) < userLevelNum && userLevelNum > 0)
    };`;

if (startIndex !== -1) {
    content = content.substring(0, startIndex) + newGroup + content.substring(endIndex);
    fs.writeFileSync(file, content);
    console.log('ManageCourses carryover logic updated!');
} else {
    console.log('Could not find groupedCourses.');
}
