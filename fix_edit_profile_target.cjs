const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\EditProfile.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetUI = `<div className="relative z-0 pt-4">
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Daily Quiz Target</label>
                        <div className="grid grid-cols-4 gap-2 md:gap-3 w-full">
                            {[
                                { val: 10, label: 'CASUAL' },
                                { val: 25, label: 'REGULAR' },
                                { val: 50, label: 'SERIOUS' },
                                { val: 100, label: 'INTENSE' }
                            ].map(t => (
                                <div
                                    key={t.val}
                                    onClick={() => setEditDailyTarget(t.val)}
                                    className={\`cursor-pointer rounded-xl p-3 md:p-4 flex flex-col items-center justify-center border-2 transition-all \${editDailyTarget === t.val ? 'border-[#FF6B00] bg-[#FFF5F0] dark:bg-orange-950/20' : 'border-gray-100 dark:border-gray-800 bg-[#F8F9FA] dark:bg-[#1A1A1A] hover:border-gray-200 dark:hover:border-gray-700'}\`}
                                >
                                    <span className={\`text-lg md:text-xl font-black mb-0.5 \${editDailyTarget === t.val ? 'text-[#FF6B00]' : 'text-[#1A1A1A] dark:text-white'}\`}>{t.val}</span>
                                    <span className={\`text-[8px] uppercase tracking-widest font-extrabold \${editDailyTarget === t.val ? 'text-[#FF6B00]' : 'text-gray-400'}\`}>{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>`;

// Use regex to insert it right before the Email Address div
const regex = /(<div className="pt-2 relative z-0">\s*<label[^>]*>Email Address<\/label>)/;
if (regex.test(content)) {
    content = content.replace(regex, targetUI + '\n                    $1');
    fs.writeFileSync(file, content);
    console.log('Successfully injected daily goal selector!');
} else {
    console.log('Could not find injection point.');
}
