const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. premium tears
content = content.replace(
  'Read exactly what will drop.<br />Avoid premium tears.',
  'Read exactly what will drop.<br />Avoid <span className="text-[#FF6B00]">premium tears</span>.'
);

// 2. you study
content = content.replace(
  'Find courses by what you study.',
  'Find courses by what <span className="text-[#FF6B00]">you study</span>.'
);

// 3. Dominate
content = content.replace(
  'Study right. Test yourself. Dominate.',
  'Study right. Test yourself. <span className="text-[#FF6B00]">Dominate.</span>'
);

// 4. lifesaver
content = content.replace(
  'The ultimate night before<br/>lifesaver.',
  'The ultimate night before<br/><span className="text-[#FF6B00]">lifesaver</span>.'
);

// 5. Super Recall
content = content.replace(
  'Start free.<br/>Do more with Super Recall.',
  'Start free.<br/>Do more with <span className="text-[#FF6B00]">Super Recall</span>.'
);

// 6. Topics grid
content = content.replace(
  "{['Commercial Law', 'Criminal Law', 'Law of Torts', 'Anatomy', 'Physiology', 'GST 101'].map",
  "{['Commercial Law', 'Criminal Law', 'Law of Torts', 'Legal System', 'Contract', 'Constitutional Law'].map"
);

fs.writeFileSync(file, content);
console.log('Text highlights and topics updated!');
