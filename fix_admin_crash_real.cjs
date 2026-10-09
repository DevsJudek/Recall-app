const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the bad injection
const wrongStart = content.indexOf('const groupedProfiles = useMemo');
if (wrongStart !== -1) {
    const wrongEnd = content.indexOf('}, [profiles]);', wrongStart) + 15;
    content = content.substring(0, wrongStart) + "return (a.code || '').localeCompare(b.code || '');" + content.substring(wrongEnd);
    console.log('Cleaned bad injection');
}

// Find the CORRECT return ( which starts the main JSX output
// It is right after `inspectedTopicReadings` useMemo
const anchor = '}, [inspectingTopic, inspectingCourse, readings]);';
const anchorIdx = content.indexOf(anchor);

if (anchorIdx !== -1) {
    const correctInjection = `
    const groupedProfiles = useMemo(() => {
        return profiles.reduce((acc, user) => {
            let rawCampus = user.campus || 'Unknown School';
            if (rawCampus.toLowerCase().includes('oau') || rawCampus.toLowerCase().includes('obafemi')) {
                rawCampus = 'Obafemi Awolowo University (OAU)';
            }
            const group = \`\${rawCampus} • \${user.department || 'Unknown Dept'} • \${user.level || 'Unknown Class'}\`;
            if (!acc[group]) acc[group] = [];
            acc[group].push(user);
            return acc;
        }, {});
    }, [profiles]);
`;
    const insertIdx = anchorIdx + anchor.length;
    content = content.substring(0, insertIdx) + correctInjection + content.substring(insertIdx);
    fs.writeFileSync(file, content);
    console.log('Injected successfully at the right spot!');
} else {
    console.log('Could not find anchor.');
}
