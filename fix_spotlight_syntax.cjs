const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\components\\ui\\spotlight-new.jsx';
let content = fs.readFileSync(file, 'utf8');

// Strip the TypeScript prop definition that's causing the Parse Error
content = content.replace(/\}: SpotlightProps = \{\}\) => \{/g, '}) => {');

// The original file used hsla(210... for blue. We will swap it to hsla(24... for orange.
content = content.replace(/hsla\(210,/g, 'hsla(24,');

fs.writeFileSync(file, content);
console.log('Fixed Spotlight syntax error and applied orange gradients!');
