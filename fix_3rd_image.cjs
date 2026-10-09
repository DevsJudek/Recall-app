const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const brokenImg = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';
const newImg = 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f';

if (content.includes(brokenImg)) {
    content = content.replace(brokenImg, newImg);
    fs.writeFileSync(file, content);
    console.log('Fixed 3rd image!');
} else {
    console.log('Could not find 3rd image.');
}
