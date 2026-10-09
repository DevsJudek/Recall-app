const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "['Commercial Law', 'Criminal Law', 'Law of Torts', 'Constitutional Law', 'Contract Law', 'GST 101', 'Anatomy', 'Physiology', 'Sociology', 'Jurisprudence', 'Company Law', 'Evidence Law']",
  "['Commercial Law', 'Criminal Law', 'Law of Torts', 'Anatomy', 'Physiology', 'GST 101']"
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
