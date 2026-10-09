const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<h1 className="text-\[40px\] md:text-\[72px\] leading-\[1\.05\] font-\[550\] mb-8 tracking-\[-0\.04em\] text-gray-900 dark:text-white">[\s\S]*?<\/h1>/;

if (regex.test(content)) {
  content = content.replace(regex, '<TextGenerateEffect className="mb-8" words="Read exactly what will drop. <br/> Avoid premium tears." />');
  fs.writeFileSync(file, content);
  console.log('Hero header successfully replaced with TextGenerateEffect!');
} else {
  console.log('Regex failed to match the H1 tag.');
}
