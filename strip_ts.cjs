const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\components\\ui\\glowing-effect.jsx';
let content = fs.readFileSync(file, 'utf8');

// Strip TypeScript syntaxes
content = content.replace(/<HTMLDivElement>/g, '');
content = content.replace(/<number>/g, '');
content = content.replace(/\(e\?: MouseEvent \| \{ x: number; y: number \}\) => \{/g, '(e) => {');
content = content.replace(/\(e: PointerEvent\) =>/g, '(e) =>');
content = content.replace(/\} as React\.CSSProperties/g, '}');

fs.writeFileSync(file, content);
console.log('Stripped remaining TypeScript from glowing-effect.jsx');
