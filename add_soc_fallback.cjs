const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = "{ code: 'PHL 319', title: 'Philosophy of Law I', level: '300L', department: 'Philosophy', type: 'Restricted', semester: '1st Semester', is_available: true }";

if (content.includes(anchor)) {
    const newAnchor = `{ code: 'PHL 319', title: 'Philosophy of Law I', level: '300L', department: 'Philosophy', type: 'Restricted', semester: '1st Semester', is_available: true },
          { code: 'SOC 201', title: 'Sociology I', level: '200L', department: 'Sociology', type: 'Restricted', semester: '1st Semester', is_available: true }`;
    
    content = content.replace(anchor, newAnchor);
    fs.writeFileSync(file, content);
    console.log('Added SOC 201 to fallback courses!');
} else {
    console.log('Could not find anchor string in App.jsx');
}
