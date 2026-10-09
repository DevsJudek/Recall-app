const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const group = `\$\{user\.level \|\| 'Unknown'\} \$\{user\.department \|\| 'Unknown'\}`;/;
const newGroup = "const group = `${user.campus || 'Unknown School'} • ${user.department || 'Unknown Dept'} • ${user.level || 'Unknown Class'}`;";

if (content.match(regex)) {
    content = content.replace(regex, newGroup);
    
    // Also update the UI label to be more explicit about students count
    const uiRegex = /<span className="text-\[\#1A1A1A\] ml-2">\{usersInGroup\.length\}<\/span>/;
    const newUi = '<span className="text-[#1A1A1A] ml-2">({usersInGroup.length} Students)</span>';
    content = content.replace(uiRegex, newUi);
    
    fs.writeFileSync(file, content);
    console.log('AdminDashboard grouping updated!');
} else {
    console.log('Could not find the target code block.');
}
