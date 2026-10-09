const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = 'Start studying for free <ArrowUpRight />';
const buttonEndIdx = content.indexOf('</button>', content.indexOf(anchor));

if (buttonEndIdx !== -1) {
    const divEndIdx = content.indexOf('</div>', buttonEndIdx) + 6;
    
    // Remove mb-16 from the wrapper
    const wrapperStart = content.lastIndexOf('<div', content.indexOf(anchor));
    if (wrapperStart !== -1) {
        const wrapperTag = content.substring(wrapperStart, content.indexOf('>', wrapperStart) + 1);
        content = content.replace(wrapperTag, wrapperTag.replace('mb-16', ''));
    }

    const statsUI = `
              {stats.students > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500 dark:text-gray-400 font-medium mb-16 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 mr-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-[10px]">🎓</div>
                        <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-[10px]">💼</div>
                        <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-[10px]">📚</div>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{stats.students.toLocaleString()}</span> Students
                    </div>
                    
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    
                    <div className="flex items-center gap-1.5">
                       <span className="font-bold text-gray-900 dark:text-white">{stats.courses.toLocaleString()}</span> Courses
                    </div>
                    
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    
                    <div className="flex items-center gap-1.5">
                       <span className="font-bold text-gray-900 dark:text-white">{stats.questions.toLocaleString()}</span> Questions
                    </div>
                  </div>
              )}`;

    // Re-find divEndIdx because content changed
    const newDivEndIdx = content.indexOf('</div>', content.indexOf(anchor)) + 6;
    content = content.substring(0, newDivEndIdx) + statsUI + content.substring(newDivEndIdx);

    fs.writeFileSync(file, content);
    console.log('Added stats under CTA!');
} else {
    console.log('Could not find anchor.');
}
