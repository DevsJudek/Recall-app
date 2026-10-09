const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const brokenImg1 = 'https://images.unsplash.com/photo-1531123897727-8f129e1bf38c?auto=format&fit=crop&w=100&h=100&q=80';
const brokenImg2 = 'https://images.unsplash.com/photo-1506869640319-fea1a2ab8e40?auto=format&fit=crop&w=100&h=100&q=80';

const newImg1 = 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=100&h=100&q=80';
const newImg2 = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80';

if (content.includes(brokenImg1) && content.includes(brokenImg2)) {
    content = content.replace(brokenImg1, newImg1);
    content = content.replace(brokenImg2, newImg2);
    fs.writeFileSync(file, content);
    console.log('Fixed broken images!');
} else {
    console.log('Could not find broken images in file.');
}
