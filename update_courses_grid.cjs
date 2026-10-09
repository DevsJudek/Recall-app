const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\['Commercial Law', 'Criminal Law', 'Law of Torts', 'Anatomy', 'Physiology', 'GST 101'\]\.map\(\(topic, idx\) => \([\s\S]*?<\/div>\n              \)\)\}/m;

const newGridCode = `{['Commercial Law', 'Criminal Law', 'Law of Torts', 'Anatomy', 'Physiology', 'GST 101'].map((topic, idx) => (
                <div key={topic} className="flex items-center p-6 md:p-8 bg-[#f8f9fa] dark:bg-[#0a0a0a]">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                    </div>
                    <span className="font-medium text-[17px] text-gray-900 dark:text-gray-100">{topic}</span>
                  </div>
                </div>
              ))}`;

if (regex.test(content)) {
  content = content.replace(regex, newGridCode);
  fs.writeFileSync(file, content);
  console.log('Courses grid updated to be non-clickable.');
} else {
  console.log('Regex failed.');
}
