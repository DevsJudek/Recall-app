const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\AdminDashboard.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\\n');

// In JS, splitting by '\\n' leaves '\\r' if it's CRLF. So let's handle that properly.
let content = fs.readFileSync(file, 'utf8');
let rawLines = content.split(/\\r?\\n/);

const start = rawLines.findIndex(l => l.includes('{profiles.map((user, idx) => ('));
const end = rawLines.findIndex((l, i) => i > start && l.includes('))}'));

if (start !== -1 && end !== -1) {
    const replacement = \`                                {Object.entries(profiles.reduce((acc, user) => {
                                    const group = \\\`\\\${user.level || 'Unknown'} \\\${user.department || 'Unknown'}\\\`;
                                    if (!acc[group]) acc[group] = [];
                                    acc[group].push(user);
                                    return acc;
                                }, {})).map(([groupName, usersInGroup]) => (
                                    <div key={groupName} className="mb-8">
                                        <h3 className="text-sm font-black text-[#FF6B00] uppercase tracking-widest mb-4 bg-[#FFF5F0] inline-block px-3 py-1.5 rounded-lg border border-[#FFD5C2]">
                                            {groupName} <span className="text-[#1A1A1A] ml-2">{usersInGroup.length}</span>
                                        </h3>
                                        <div className="space-y-3">
                                            {usersInGroup.map((user, idx) => (
                                                <div key={user.id} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-transparent hover:border-[#E5E5E5] transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm font-black text-gray-400 w-6">#{idx + 1}</span>
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD5C2] to-[#FF6B00] text-white flex items-center justify-center font-black overflow-hidden shadow-sm">
                                                            {user.avatar && user.avatar.startsWith('http') ? (
                                                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                                            ) : (
                                                                (user.name || 'U').charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#1A1A1A] text-sm">{user.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-500">{user.email || 'No email'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-right">
                                                        <div>
                                                            <p className="text-sm font-black text-[#FF6B00]">🔥 {user.current_streak || 0}</p>
                                                            <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase mt-0.5">Streak</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-[#1A1A1A]">{user.points || 0}</p>
                                                            <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase mt-0.5">XP</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}\`.split('\\n');
                                
    // Delete the old map block and insert the new one
    rawLines.splice(start, end - start + 1, ...replacement);
    
    fs.writeFileSync(file, rawLines.join('\\n'));
    console.log('Successfully patched AdminDashboard.jsx!');
} else {
    console.log('Failed to find start or end block.');
}
