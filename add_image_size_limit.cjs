const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\App.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldLine = `const file = e.target.files[0]; if (!file) return; setIsUploading(true);`;
const newLine = `const file = e.target.files[0]; if (!file) return; 
    
    if (file.size > 1024 * 1024) {
      alert("your image is larger than 1mb, please select another image");
      e.target.value = null;
      return;
    }
    
    setIsUploading(true);`;

content = content.replace(oldLine, newLine);

fs.writeFileSync(file, content);
console.log('Added 1MB size limit check to handleImageUpload!');
