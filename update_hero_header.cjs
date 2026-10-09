const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { TextGenerateEffect }')) {
  content = content.replace(
    /import \{ CardSpotlight \} from "\.\/components\/ui\/card-spotlight";/,
    'import { CardSpotlight } from "./components/ui/card-spotlight";\nimport { TextGenerateEffect } from "./components/ui/text-generate-effect";'
  );
}

const oldHeroHeader = `<h1 className="text-[40px] md:text-[72px] leading-[1.05] font-[550] mb-8 tracking-[-0.04em] text-gray-900 dark:text-white">
                Read exactly what will drop.<br />Avoid <span className="text-[#FF6B00]">premium tears.</span>
              </h1>`;

const newHeroHeader = `<TextGenerateEffect className="mb-8" words="Read exactly what will drop. <br/> Avoid premium tears." />`;

content = content.replace(oldHeroHeader, newHeroHeader);

fs.writeFileSync(file, content);
console.log('Hero header updated to use TextGenerateEffect!');
