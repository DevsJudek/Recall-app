const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="w-full md:w-2\/3 lg:w-1\/2">[\s\S]*?<div className="bg-\[#F8F9FA\] dark:bg-\[#1A1A1A\] rounded-3xl p-6 border border-\[#E5E5E5\] dark:border-gray-800 hover:shadow-md flex flex-col justify-between transition-all cursor-pointer" onClick=\{.*?openCourseTopics\(continueCourse\)\}>[\s\S]*?Resume course [^<]*<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newCard = `<div className="w-full md:w-2/3 lg:w-1/2">
                    <div className="bg-white dark:bg-[#1A1A1A] rounded-[28px] p-5 md:p-6 border border-[#E5E5E5] dark:border-gray-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#FFD5C2] dark:hover:border-[#FF6B00] transition-all flex flex-col group cursor-pointer" onClick={() => { if (continueCourse.is_available !== false) openCourseTopics(continueCourse); }}>
                        <div className="flex justify-between items-center mb-5">
                            <span className={\`px-3 py-1 rounded-[8px] text-[10px] font-black uppercase tracking-widest border \${continueCourse.type === 'Apex' ? 'bg-[#FFF5F0] dark:bg-[#FF6B00]/10 text-[#FF6B00] border-[#FFD5C2] dark:border-[#FF6B00]/20' : 'bg-[#F8F9FA] dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700'}\`}>
                                {continueCourse.code}
                            </span>
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{continueCourse.units || 4} UNITS</span>
                        </div>
                        <h3 className="text-xl font-black text-[#1A1A1A] dark:text-white mb-4 leading-snug">{continueCourse.title}</h3>
                        <div className="flex items-center gap-5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-5">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#FF6B00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8l8-4 8 4-8-4zm0 4l8 4 8-4m-16 4l8 4 8-4" /></svg>
                                {continueCourse.topics_count || 4} Topics
                            </span>
                        </div>
                        <div className="mb-6">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">MASTERY</span>
                                <span className="text-xs font-black text-[#FF6B00]">{courseMastery}%</span>
                            </div>
                            <div className="w-full bg-[#F3F4F6] dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" style={{ width: \`\${courseMastery}%\` }}></div>
                            </div>
                        </div>
                        <div className="mt-auto pt-1">
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 italic font-medium mb-3">
                                Last studied {continueCourse.last_studied || 'recently'}
                            </p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); openCourseTopics(continueCourse); }} className="w-full py-3 text-sm font-bold rounded-[14px] transition-all flex items-center justify-center gap-2 bg-[#F8F9FA] dark:bg-gray-800 text-[#1A1A1A] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
                                Resume course &rarr;
                            </button>
                        </div>
                    </div>
                  </div>`;

if (regex.test(content)) {
  content = content.replace(regex, newCard);
  fs.writeFileSync(file, content);
  console.log('Dashboard continue card updated successfully!');
} else {
  console.log('Regex failed to match the dashboard continue card.');
}
