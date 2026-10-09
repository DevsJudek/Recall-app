const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Inject useMemo for groupedProfiles
const useMemoInjection = `    // Readings for inspected topic
    const inspectedTopicReadings = useMemo(() => {
        if (!inspectingTopic || !inspectingCourse) return [];
        const lookupCodes = getLookupCourseCodes(inspectingCourse.code);
        return readings.filter(r => 
            lookupCodes.includes(r.course_code) &&
            (r.topic || '').trim() === inspectingTopic.trim()
        );
    }, [inspectingTopic, inspectingCourse, readings]);

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
    }, [profiles]);`;

const target1 = `    // Readings for inspected topic
    const inspectedTopicReadings = useMemo(() => {
        if (!inspectingTopic || !inspectingCourse) return [];
        const lookupCodes = getLookupCourseCodes(inspectingCourse.code);
        return readings.filter(r => 
            lookupCodes.includes(r.course_code) &&
            (r.topic || '').trim() === inspectingTopic.trim()
        );
    }, [inspectingTopic, inspectingCourse, readings]);`;

if (content.includes(target1)) {
    content = content.replace(target1, useMemoInjection);
}

// 2. Inject Pills into the UI
const uiTarget = `<div className="flex items-center justify-between mb-6 px-2">
                                <div>
                                    <h2 className="text-xl font-black text-[#1A1A1A]">User Database</h2>
                                    <p className="text-xs text-gray-400 font-medium">{profiles.length} registered students</p>
                                </div>
                            </div>`;
                            
const uiInjection = `<div className="flex items-center justify-between mb-4 px-2">
                                <div>
                                    <h2 className="text-xl font-black text-[#1A1A1A]">User Database</h2>
                                    <p className="text-xs text-gray-400 font-medium">{profiles.length} registered students</p>
                                </div>
                            </div>
                            
                            {/* OVERVIEW PILLS */}
                            <div className="flex flex-wrap gap-2 px-2 mb-8">
                                {Object.entries(groupedProfiles).sort((a, b) => b[1].length - a[1].length).map(([groupName, users]) => (
                                    <div key={groupName} className="flex items-center bg-[#F8F9FA] border border-[#E5E5E5] rounded-full px-3 py-1.5 shadow-sm">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mr-2">{groupName}</span>
                                        <span className="text-[10px] font-black text-[#FF6B00] bg-[#FFF5F0] px-2 py-0.5 rounded-full border border-[#FFD5C2]">
                                            {users.length} {users.length === 1 ? 'Student' : 'Students'}
                                        </span>
                                    </div>
                                ))}
                            </div>`;

if (content.includes(uiTarget)) {
    content = content.replace(uiTarget, uiInjection);
}

// 3. Update the space-y-3 mapping to use groupedProfiles instead of inline Object.entries
const oldMapTarget = `{Object.entries(profiles.reduce((acc, user) => {
                                    let rawCampus = user.campus || 'Unknown School';
                                      if (rawCampus.toLowerCase().includes('oau') || rawCampus.toLowerCase().includes('obafemi')) {
                                          rawCampus = 'Obafemi Awolowo University (OAU)';
                                      }
                                      const group = \`\${rawCampus} • \${user.department || 'Unknown Dept'} • \${user.level || 'Unknown Class'}\`;
                                    if (!acc[group]) acc[group] = [];
                                    acc[group].push(user);
                                    return acc;
                                }, {})).map(([groupName, usersInGroup]) => (`;

const newMapTarget = `{Object.entries(groupedProfiles).map(([groupName, usersInGroup]) => (`;

// Since regexing multiline string literals can be flaky with formatting, I'll use a dynamic substring replace
const startOldMap = content.indexOf('{Object.entries(profiles.reduce((acc, user) => {');
if (startOldMap !== -1) {
    const endOldMap = content.indexOf('})).map(([groupName, usersInGroup]) => (', startOldMap);
    if (endOldMap !== -1) {
        const toReplace = content.substring(startOldMap, endOldMap + '})).map(([groupName, usersInGroup]) => ('.length);
        content = content.replace(toReplace, newMapTarget);
    }
}

fs.writeFileSync(file, content);
console.log('Overview pills added!');
