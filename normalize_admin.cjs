const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldLogic = "const group = `${user.campus || 'Unknown School'} • ${user.department || 'Unknown Dept'} • ${user.level || 'Unknown Class'}`;";
const newLogic = `let rawCampus = user.campus || 'Unknown School';
                                      if (rawCampus.toLowerCase().includes('oau') || rawCampus.toLowerCase().includes('obafemi')) {
                                          rawCampus = 'Obafemi Awolowo University (OAU)';
                                      }
                                      const group = \`\${rawCampus} • \${user.department || 'Unknown Dept'} • \${user.level || 'Unknown Class'}\`;`;

if (content.includes(oldLogic)) {
    content = content.replace(oldLogic, newLogic);
    fs.writeFileSync(file, content);
    console.log('Admin Dashboard campus normalization added!');
} else {
    console.log('Could not find the target code string in AdminDashboard.jsx');
}
