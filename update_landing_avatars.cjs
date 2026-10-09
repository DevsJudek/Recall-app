const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                      <div className="flex -space-x-1.5 mr-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-[10px]">🎓</div>
                        <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-[10px]">💼</div>
                        <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center text-[10px]">📚</div>
                      </div>`;

const newStr = `                      <div className="flex -space-x-2 mr-1">
                        <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf38c?auto=format&fit=crop&w=100&h=100&q=80" alt="Student" className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0a0a0a] object-cover" />
                        <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=100&h=100&q=80" alt="Student" className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0a0a0a] object-cover" />
                        <img src="https://images.unsplash.com/photo-1506869640319-fea1a2ab8e40?auto=format&fit=crop&w=100&h=100&q=80" alt="Student" className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0a0a0a] object-cover" />
                      </div>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Replaced emoji avatars with Nigerian student images!');
} else {
    console.log('Could not find the target string. Maybe it was modified?');
}
