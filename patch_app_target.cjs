const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state for editDailyTarget
content = content.replace(
  "const [editLevel, setEditLevel] = useState('300L');",
  "const [editLevel, setEditLevel] = useState('300L');\n  const [editDailyTarget, setEditDailyTarget] = useState(25);"
);

// 2. Update setEditDailyTarget inside fetchUserProfile
content = content.replace(
  "setDailyTarget(userProfile.daily_target || 25);",
  "setDailyTarget(userProfile.daily_target || 25);\n        setEditDailyTarget(userProfile.daily_target || 25);"
);

// 3. Update handleSaveProfile to include daily target
content = content.replace(
  "let updatePayload = { name: editName, avatar: editAvatarUrl, department: editDepartment, level: editLevel, bio: editBio, campus: editCampus };",
  "let updatePayload = { name: editName, avatar: editAvatarUrl, department: editDepartment, level: editLevel, bio: editBio, campus: editCampus, daily_target: editDailyTarget };"
);

content = content.replace(
  "setDisplayName(editName); setAvatarUrl(editAvatarUrl); setDepartment(editDepartment); setLevel(editLevel); setBio(editBio); setCampus(editCampus);",
  "setDisplayName(editName); setAvatarUrl(editAvatarUrl); setDepartment(editDepartment); setLevel(editLevel); setBio(editBio); setCampus(editCampus); setDailyTarget(editDailyTarget);"
);

// 4. Pass it to globalProps
content = content.replace(
  "editCampus, setEditCampus,",
  "editCampus, setEditCampus, editDailyTarget, setEditDailyTarget,"
);

fs.writeFileSync(file, content);
console.log('App.jsx patched for daily target state!');
