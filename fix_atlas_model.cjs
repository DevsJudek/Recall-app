const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Reading.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Revert Model
const oldModel = 'model: "llama3-70b-8192",';
const newModel = 'model: "openai/gpt-oss-120b",';

if (content.includes(oldModel)) {
    content = content.replace(oldModel, newModel);
}

// 2. Make Prompt Stricter
const oldPrompt = `ABSOLUTELY DO NOT use Markdown tables. Tables are strictly forbidden. If you need to compare concepts, use bullet 
points or numbered lists instead. Answer questions based primarily on the module text provided above. Do not give 
direct answers if it's a quiz, guide them.`;

const newPrompt = `CRITICAL INSTRUCTION: YOU MUST NEVER GENERATE A MARKDOWN TABLE. UNDER NO CIRCUMSTANCES ARE TABLES ALLOWED. DO NOT USE THE '|' CHARACTER TO FORMAT TABLES. If you need to compare concepts, you MUST use bullet points or numbered lists instead. If you generate a table, you will be penalized. Answer questions based primarily on the module text provided above. Do not give direct answers if it's a quiz, guide them.`;

if (content.includes(oldPrompt)) {
    content = content.replace(oldPrompt, newPrompt);
} else {
    // try removing newlines from search
    const normalizedContent = content.replace(/\r/g, '');
    const promptSearch = `ABSOLUTELY DO NOT use Markdown tables. Tables are strictly forbidden. If you need to compare concepts, use bullet \npoints or numbered lists instead. Answer questions based primarily on the module text provided above. Do not give \ndirect answers if it's a quiz, guide them.`;
    
    if (normalizedContent.includes(promptSearch)) {
         content = normalizedContent.replace(promptSearch, newPrompt);
    }
}

fs.writeFileSync(file, content);
console.log('Fixed Groq model and made table prompt strictly aggressive!');
