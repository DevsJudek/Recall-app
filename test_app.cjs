const coursesData = [];
const contentFallbackCourses = [
    { code: 'PUL 205', title: 'Human Rights I', level: '200L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true },
];
const allRaw = [...(coursesData || [])];
contentFallbackCourses.forEach(d => { if (!allRaw.find(c => c.code === d.code)) allRaw.push(d); });

const dynamicCourses = allRaw.map(c => {
    const code = c.code?.toUpperCase() || '';
    let type = c.type;
    let dept = c.department;
    let semester = c.semester;
    let levelAssigned = c.level;

    if (c.title?.toLowerCase().includes('human rights i')) {
        type = 'Core Elective'; semester = '1st Semester'; levelAssigned = '200L'; dept = 'Law';
    } else {
        type = type || 'Main';
        dept = dept || 'Law';
    }
    return { ...c, code, type, department: dept, semester, level: levelAssigned };
});
console.log(dynamicCourses);

