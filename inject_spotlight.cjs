const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { Spotlight }')) {
  // Insert import
  content = content.replace(
    /import \{ TextGenerateEffect \} from "\.\/components\/ui\/text-generate-effect";/,
    'import { TextGenerateEffect } from "./components/ui/text-generate-effect";\nimport { Spotlight } from "./components/ui/spotlight-new";'
  );
}

if (!content.includes('<Spotlight />')) {
  // Insert Spotlight at the top of the app container
  content = content.replace(
    /\{scrolled \? 'bg-white\/70/, // this is inside the header, meaning we should find the wrapper just before the header
    match => match // Just a dummy, let's use a better replace
  );

  content = content.replace(
    /\{ \/\* HEADER \*\/ \}/,
    '{ /* SPOTLIGHT */ }\n        <div className="hidden dark:block"><Spotlight /></div>\n\n        { /* HEADER */ }'
  );

  fs.writeFileSync(file, content);
  console.log('Spotlight injected into Landing Page!');
}
