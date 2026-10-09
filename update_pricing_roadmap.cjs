const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update the Super Recall checklist array
content = content.replace(
  "{['Full access to all course libraries', 'Unlimited daily ranked tests', 'Detailed answer explanations', 'Offline mode support', 'Priority community access', 'No automatic renewal']",
  "{['Full access to your class course library', 'Unlimited daily ranked tests', 'Detailed answer explanations', 'Priority community access']"
);

// 2. Update the disclaimer below the Get Super Recall button
content = content.replace(
  "Buy one semester of Super Recall. No automatic renewal.",
  "Offline mode comes with our native Android and iOS builds which will be in development soon."
);

// 3. Update the FAQ answer for offline mode
const oldFaqAnswer = "Offline access is available for Super Recall members. You can download courses and quizzes to your device and sync your progress when you reconnect to the internet.";
const newFaqAnswer = "Offline mode will be available natively on our upcoming Android and iOS mobile apps, which will be entering development soon!";
content = content.replace(oldFaqAnswer, newFaqAnswer);

fs.writeFileSync(file, content);
console.log('Pricing and FAQ updated for offline mode!');
