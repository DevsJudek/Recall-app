const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Reading.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldModel = 'model: "openai/gpt-oss-120b",';
const newModel = 'model: "llama3-70b-8192",'; // A valid and highly capable Groq model

if (content.includes(oldModel)) {
    content = content.replace(oldModel, newModel);
    fs.writeFileSync(file, content);
    console.log('Fixed Groq model name!');
} else {
    console.log('Could not find the old model string.');
}
