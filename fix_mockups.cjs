const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the animation overwrite by moving animate-float-breathe to the img tags
// Left Phone
content = content.replace(
  'z-10 animate-float-breathe-delayed">\n               <img src="/mockups/courses.png" alt="Courses" className="w-full h-auto object-contain" />',
  'z-10">\n               <img src="/mockups/courses.png" alt="Courses" className="w-full h-auto object-contain animate-float-breathe-delayed" />'
);

// Center Phone
content = content.replace(
  'z-30 animate-float-breathe">\n               <img src="/mockups/quiz.png" alt="Quiz" className="w-full h-auto object-contain" />',
  'z-30">\n               <img src="/mockups/quiz.png" alt="Quiz" className="w-full h-auto object-contain animate-float-breathe" />'
);

// Right Phone
content = content.replace(
  'z-20 animate-float-breathe-slow">\n               <img src="/mockups/leaderboard.png" alt="Leaderboard" className="w-full h-auto object-contain" />',
  'z-20">\n               <img src="/mockups/leaderboard.png" alt="Leaderboard" className="w-full h-auto object-contain animate-float-breathe-slow" />'
);

// 2. Default the website to dark mode
content = content.replace(
  'const [isDark, setIsDark] = useState(false);',
  'const [isDark, setIsDark] = useState(true);'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
