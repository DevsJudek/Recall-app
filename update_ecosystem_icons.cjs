const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update DocumentIcon
content = content.replace(
  'const DocumentIcon = () => (\n  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">',
  'const DocumentIcon = () => (\n  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-500 dark:text-gray-300">'
);

// Update ZapIcon
content = content.replace(
  'const ZapIcon = () => (\n  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">',
  'const ZapIcon = () => (\n  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-500 dark:text-gray-300">'
);

// Update TrophyIcon
content = content.replace(
  'const TrophyIcon = () => (\n  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">',
  'const TrophyIcon = () => (\n  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-500 dark:text-gray-300">'
);

fs.writeFileSync(file, content);
console.log('Icons scaled and color contrast improved!');
