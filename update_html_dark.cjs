const fs = require('fs');

function updateHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add class="dark" to html tag
  content = content.replace('<html lang="en">', '<html lang="en" class="dark">');

  // 2. Change inline style to dark mode defaults to prevent FOUC (Flash of Unstyled Content)
  content = content.replace('background-color: #f8fafc;', 'background-color: #0a0a0a;');
  content = content.replace('color: #0f172a;', 'color: #ffffff;');

  // 3. Update theme-color meta tag for mobile browsers (status bar)
  content = content.replace(
    '<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />',
    '<meta name="theme-color" content="#0a0a0a" />'
  );
  content = content.replace(
    '<meta name="color-scheme" content="light" />',
    '<meta name="color-scheme" content="dark" />'
  );

  fs.writeFileSync(filePath, content);
}

updateHtml('C:\\Users\\kolaw\\recall-app\\index.html');
updateHtml('C:\\Users\\kolaw\\recall-app\\app.html');
console.log('HTML files updated for default dark mode!');
