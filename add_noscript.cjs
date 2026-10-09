const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\index.html';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '<div id="root"></div>';
const newStr = `<noscript>
    <div style="display: none;">
      <h1>Recall - Interactive Study Platform</h1>
      <p>Join thousands of applicants, students, and professionals dominating their exams with the right materials. Create your account and build your first streak.</p>
      <p>Over 10,000+ Students, 200+ Courses, and 50,000+ Exam Questions available.</p>
      <p>Whether you are writing JAMB, surviving your undergrad, or preparing for Law School, stop reading off point. Recall gives you hyper tailored notes mapped perfectly to your exact syllabus, paired with an AI tutor and addictive gamification.</p>
    </div>
  </noscript>
  <div id="root"></div>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync(file, content);
    console.log('Added SEO noscript block to index.html!');
} else {
    console.log('Could not find root div.');
}
