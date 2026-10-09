const fs = require('fs');
const htmlString = JSON.parse(fs.readFileSync('C:\\Users\\kolaw\\.gemini\\antigravity\\brain\\eb5a1904-aebd-4811-9280-d7645f54a86c\\scratch\\landing_page_html.json', 'utf8'));
fs.writeFileSync('C:\\Users\\kolaw\\recall-app\\sitalk_dump.html', htmlString);
