const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://ui.aceternity.com/registry/spotlight-new.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.files && json.files.length > 0) {
        let code = json.files[0].content;
        
        // Fix imports
        code = code.replace(/import \{ motion \} from "motion\/react";/g, 'import { motion } from "framer-motion";');
        
        // Strip TS interfaces
        code = code.replace(/type SpotlightProps = \{[\s\S]*?\};/, '');
        
        // Strip TS props type
        code = code.replace(/\{ gradientFirst = "radial-gradient\(68\.54% 68\.72% at 55\.02% 31\.46%, hsla\(210, 100%, 85%, \.08\) 0, hsla\(210, 100%, 55%, \.02\) 50%, hsla\(210, 100%, 45%, 0\) 80%\)", gradientSecond = "radial-gradient\(50% 50% at 50% 50%, hsla\(210, 100%, 85%, \.06\) 0, hsla\(210, 100%, 55%, \.02\) 80%, transparent 100%\)", gradientThird = "radial-gradient\(50% 50% at 50% 50%, hsla\(210, 100%, 85%, \.04\) 0, hsla\(210, 100%, 45%, \.02\) 80%, transparent 100%\)", translateY = -350, width = 560, height = 1380, className, \}: SpotlightProps/g, '{ gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(24, 100%, 85%, .08) 0, hsla(24, 100%, 55%, .02) 50%, hsla(24, 100%, 45%, 0) 80%)", gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(24, 100%, 85%, .06) 0, hsla(24, 100%, 55%, .02) 80%, transparent 100%)", gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(24, 100%, 85%, .04) 0, hsla(24, 100%, 45%, .02) 80%, transparent 100%)", translateY = -350, width = 560, height = 1380, className }');

        const dir = path.join('C:\\Users\\kolaw\\recall-app\\src\\components\\ui');
        fs.writeFileSync(path.join(dir, 'spotlight-new.jsx'), code);
        console.log('SpotlightNew fetched, TS stripped, and converted to ORANGE successfully!');
      }
    } catch(e) {
      console.log('Fetch error: ', e);
    }
  });
});
