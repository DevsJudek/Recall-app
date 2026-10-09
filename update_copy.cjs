const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  // 1. Hero
  ['Master your exams.<br />Outperform the curve.', 'Read exactly what will drop.<br />Avoid premium tears.'],
  ['Your ultimate study companion. Access high-yield summaries, practice with exam-style quizzes, and compete on the leaderboard to secure that A.', 'Whether you are writing JAMB, surviving your undergrad, or preparing for Law School, stop reading off-point. Recall gives you hyper-tailored notes mapped perfectly to your exact syllabus, paired with an AI tutor and addictive gamification.'],
  // Add secondary button
  ['Start studying for free <ArrowUpRight />\n              </button>\n            </div>', 'Start studying for free <ArrowUpRight />\n              </button>\n              <button onClick={onLoginClick} className="w-full sm:w-auto flex items-center justify-center bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-[16px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors shadow-sm">\n                Explore the library\n              </button>\n            </div>'],

  // 2. Features
  ['Everything you need to secure that A.', "Exactly what you need to pass. Nothing you don't."],
  ['title: "High-yield summaries"', 'title: "The Exact AOC"'],
  ['desc: "Master complex topics with concise, expert-curated notes."', 'desc: "Stop wasting time on 500-page textbooks. Get bite-sized notes tailored perfectly to your specific exam—from university entrance tests to postgraduate Bar finals."'],
  ['title: "Interactive ranked tests"', 'title: "Interactive Ranked Tests"'],
  ['desc: "Test your knowledge with exam-style questions under pressure."', 'desc: "Ditch passive reading. Test your recall under pressure and see if you are actually ready for the exam hall."'],
  ['title: "Climb the leaderboard"', 'title: "Climb the Leaderboard"'],
  ['desc: "Compete with peers and track your progress globally."', 'desc: "Compete with peers, track your daily streaks, and stay motivated by studying with a community that pushes you."'],

  // 3. Courses
  ['Recall is available for Law, Agriculture, Sciences, etc.', 'Find courses by what you study.'],
  ['Law, Sciences, Arts, and General Studies. Explore hundreds of curated topics tailored to your university curriculum.', 'Law, Sciences, Arts, and General Studies. Explore hundreds of curated topics built specifically for University Applicants, Undergraduates, and Postgraduate professional exams.'],

  // 4. Ecosystem
  ['Study. Practice. Compete.', 'Study right. Test yourself. Dominate.'],
  ['A complete ecosystem designed to help you absorb knowledge faster and retain it longer.', 'A complete study ecosystem designed to cut out the fluff, save you from the night-before panic, and help you secure your admission, grades, or professional license.'],
  ["Read through high-yield summaries that cut out the fluff and focus on what's tested.", "Read through high-yield summaries that cut out the noise and focus strictly on what is tested."],
  ["Take timed quizzes that simulate the real exam environment and adapt to your weaknesses.", "Take timed quizzes that simulate the real exam environment and adapt to your knowledge gaps."],
  ["Climb the ranks on the global leaderboard and stay motivated by studying with peers.", "Climb the ranks on the localized leaderboard and secure your bragging rights."],

  // 5. Mobile Companion
  ['Your pocket<br/>study companion.', 'The ultimate night-before<br/>lifesaver.'],
  ["Study on the go. Whether you're commuting, waiting for a lecture, or relaxing at home, your entire curriculum is right in your pocket. Track your daily streaks and never miss a day of learning.", "Forgot a handout or past question? No problem. Your entire curriculum—from foundational courses to advanced postgraduate materials—is perfectly organized right in your pocket. Track your streaks, hit your target, and never study blindly again."],

  // 6. Final CTA
  ['Ready to secure<br />that A?', 'Ready to pass without<br />the exam-week panic?'],
  ['Join thousands of students crushing their exams with Recall.', 'Join thousands of applicants, students, and professionals dominating their exams with the right materials. Create your account and build your first streak.']
];

let updatedCount = 0;
for (const [search, replace] of replacements) {
  if (content.includes(search)) {
    content = content.replace(search, replace);
    updatedCount++;
  } else {
    console.error(`Could not find string: ${search}`);
  }
}

fs.writeFileSync(file, content);
console.log(`Updated ${updatedCount} out of ${replacements.length} strings successfully!`);
