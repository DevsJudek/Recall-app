const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { CardSpotlight }')) {
  // Add it after the React import
  content = content.replace(
    /import React[\s\S]*?;/,
    match => match + '\nimport { CardSpotlight } from "./components/ui/card-spotlight";'
  );
  fs.writeFileSync(file, content);
  console.log('Added missing CardSpotlight import to LandingPage.jsx');
}
