const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const useMemoInjection = `    const groupedProfiles = useMemo(() => {
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

    return (`;

if (content.includes('groupedProfiles = useMemo')) {
    console.log('Already injected!');
} else {
    const returnTarget = '    return (';
    if (content.includes(returnTarget)) {
        content = content.replace(returnTarget, useMemoInjection);
        fs.writeFileSync(file, content);
        console.log('Successfully injected groupedProfiles!');
    } else {
        console.log('Could not find return target.');
    }
}
