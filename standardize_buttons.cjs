const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && filePath.endsWith('.jsx')) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

const buttonRegex = /<button([\s\S]*?)className=(['"])(.*?)(['"])/g;
const roundedRegex = /\b(rounded-(lg|xl|2xl|3xl)|rounded-\[(8|10|12|16|24|32)px\])\b/g;

walkSync('C:\\Users\\kolaw\\recall-app\\src', function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Handle string literal classNames
    let newContent = content.replace(buttonRegex, (match, prefix, quote, classes, suffixQuote) => {
        if (roundedRegex.test(classes)) {
            hasChanges = true;
            // Standardize radius to 14px
            let newClasses = classes.replace(roundedRegex, 'rounded-[14px]');
            // Standardize orange hover
            newClasses = newClasses.replace(/hover:bg-\[#E05D00\]/g, 'hover:bg-[#E56000]');
            return `<button${prefix}className=${quote}${newClasses}${suffixQuote}`;
        }
        return match;
    });

    // Handle template literal classNames: className={`...`}
    const templateRegex = /<button([\s\S]*?)className=\{\`(.*?)\`\}/g;
    newContent = newContent.replace(templateRegex, (match, prefix, classes) => {
        if (roundedRegex.test(classes)) {
            hasChanges = true;
            let newClasses = classes.replace(roundedRegex, 'rounded-[14px]');
            newClasses = newClasses.replace(/hover:bg-\[#E05D00\]/g, 'hover:bg-[#E56000]');
            return `<button${prefix}className={\`${newClasses}\`}`;
        }
        return match;
    });

    if (hasChanges) {
        fs.writeFileSync(filePath, newContent);
        console.log('Updated buttons in: ' + filePath);
    }
});

console.log('Finished updating button border radii across the app!');
