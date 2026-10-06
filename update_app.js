const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

content = content.replace(
  /{ id: 908, code: 'PUL 303', title: 'Labor Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },\s*{ id: 909, code: 'JPL 303', title: 'Family Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },/,
  { id: 908, code: 'BUL 305', title: 'Labor Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },\n        { id: 909, code: 'JPL 305', title: 'Family Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },
);

content = content.replace(
  /{ id: 913, code: 'PHL 301', title: 'Philosophy of Law I', level: '300L', department: 'Philosophy', type: 'Restricted Elective', semester: '1st Semester', is_available: true },\s*{ id: 914, code: 'HIS 301', title: 'History of Nigeria I', level: '300L', department: 'History', type: 'Restricted Elective', semester: '1st Semester', is_available: true },\s*{ id: 915, code: 'PUB 301', title: 'Public Policy Analysis I', level: '300L', department: 'Public Admin', type: 'Restricted Elective', semester: '1st Semester', is_available: true },/,
  { id: 913, code: 'PHL 301', title: 'Philosophy of Law I', units: 3, level: '300L', department: 'Philosophy', type: 'Restricted Elective', semester: '1st Semester', is_available: true },\n        { id: 914, code: 'HIS 301', title: 'History of Nigeria I', units: 3, level: '300L', department: 'History', type: 'Restricted Elective', semester: '1st Semester', is_available: true },\n        { id: 915, code: 'PUB 301', title: 'Public Policy Analysis I', units: 3, level: '300L', department: 'Public Admin', type: 'Restricted Elective', semester: '1st Semester', is_available: true },
);

content = content.replace(
  /else if \(\['BUL 303', 'PUL 303', 'JPL 303'\]\.includes\(code\)\) \{/,
  else if (['BUL 303', 'BUL 305', 'JPL 305'].includes(code)) {
);

content = content.replace(
  /if \(mode === 'ranked'\) \{\s*targetCodes = targetCodes\.filter\(code => \{\s*const c = coursesList\.find\(x => x\.code === code\);\s*return c && c\.type === 'Main';\s*\}\);\s*\}/,
  if (mode === 'ranked') {\n          targetCodes = targetCodes.filter(code => {\n            const c = coursesList.find(x => x.code === code);\n            return c && c.type !== 'Special Elective';\n          });\n        }
);

fs.writeFileSync('src/App.jsx', content);
console.log('App.jsx updated successfully!');
