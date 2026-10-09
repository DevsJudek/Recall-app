const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\kolaw\\recall-app\\sitalk_dump.html', 'utf8');

// Use basic string searching to find sections
const sections = [
  'launch-hero',
  'playground-section',
  'idea-section',
  'connection-story',
  'value-props',
  'pricing'
];

for (const section of sections) {
  const startIndex = html.indexOf(`class="${section}`);
  if (startIndex === -1) {
    const startIndex2 = html.indexOf(`class="wrap ${section}`);
    if (startIndex2 !== -1) {
       console.log(`Found ${section}`);
    }
  } else {
    console.log(`Found ${section}`);
  }
}
