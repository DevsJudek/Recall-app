const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://ui.aceternity.com/registry/glowing-effect.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.files && json.files.length > 0) {
        let code = json.files[0].content;
        
        // Ensure directory exists
        const dir = path.join('C:\\Users\\kolaw\\recall-app\\src\\components\\ui');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(dir, 'glowing-effect.jsx'), code);
        console.log('GlowingEffect component saved successfully!');
      } else {
        console.log('No files found in registry JSON');
      }
    } catch(e) {
      console.log('Parse error: ', e);
    }
  });
}).on('error', (e) => {
  console.log('Fetch error: ', e);
});
