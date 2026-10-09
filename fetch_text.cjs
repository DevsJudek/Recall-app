const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://ui.aceternity.com/registry/text-generate-effect.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.files && json.files.length > 0) {
        let code = json.files[0].content;
        
        // Strip TS
        code = code.replace(/\"use client\";/g, '');
        code = code.replace(/import \{ motion, stagger, useAnimate \} from \"framer-motion\";/g, 'import { motion, stagger, useAnimate } from "framer-motion";');
        code = code.replace(/import \{ cn \} from \"@\/lib\/utils\";/g, 'import { clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nfunction cn(...inputs) {\n  return twMerge(clsx(inputs));\n}');
        code = code.replace(/export const TextGenerateEffect = \(\{\n  words,\n  className,\n  filter = true,\n  duration = 0.5,\n\}: \{\n  words: string;\n  className\?: string;\n  filter\?: boolean;\n  duration\?: number;\n\}\) => \{/g, 'export const TextGenerateEffect = ({\n  words,\n  className,\n  filter = true,\n  duration = 0.5,\n}) => {');
        code = code.replace(/let wordsArray = words\.split\(\" \"\);/g, 'let wordsArray = words.split(" ");');

        const dir = path.join('C:\\Users\\kolaw\\recall-app\\src\\components\\ui');
        fs.writeFileSync(path.join(dir, 'text-generate-effect.jsx'), code);
        console.log('TextGenerateEffect fetched and stripped of TS!');
      }
    } catch(e) {
      console.log(e);
    }
  });
});
