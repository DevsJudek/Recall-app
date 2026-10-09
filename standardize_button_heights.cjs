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
const templateRegex = /<button([\s\S]*?)className=\{\`(.*?)\`\}/g;

walkSync('C:\\Users\\kolaw\\recall-app\\src', function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Normalizing string literal classNames
    let newContent = content.replace(buttonRegex, (match, prefix, quote, classes, suffixQuote) => {
        if (classes.includes('rounded-[14px]') && (classes.includes('py-4') || classes.includes('py-3.5'))) {
            hasChanges = true;
            let newClasses = classes.replace(/\bpy-4\b/g, 'py-3').replace(/\bpy-3\.5\b/g, 'py-3');
            return `<button${prefix}className=${quote}${newClasses}${suffixQuote}`;
        }
        return match;
    });

    // Normalizing template literal classNames
    newContent = newContent.replace(templateRegex, (match, prefix, classes) => {
        if (classes.includes('rounded-[14px]') && (classes.includes('py-4') || classes.includes('py-3.5'))) {
            hasChanges = true;
            let newClasses = classes.replace(/\bpy-4\b/g, 'py-3').replace(/\bpy-3\.5\b/g, 'py-3');
            return `<button${prefix}className={\`${newClasses}\`}`;
        }
        return match;
    });

    if (hasChanges) {
        fs.writeFileSync(filePath, newContent);
        console.log('Standardized height (py-3) in: ' + filePath);
    }
});
