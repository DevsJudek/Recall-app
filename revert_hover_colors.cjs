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

walkSync('C:\\Users\\kolaw\\recall-app\\src', function(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('hover:bg-[#E56000]') && filePath !== 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx') {
        // Only revert it in files where it wasn't originally E56000 (LandingPage originally had E56000).
        // Actually, some others might have had E56000. Let's just revert the ones we definitely changed.
        // I'll revert hover:bg-[#E56000] to hover:bg-[#E05D00] globally EXCEPT in LandingPage.jsx.
        let newContent = content.replace(/hover:bg-\[#E56000\]/g, 'hover:bg-[#E05D00]');
        fs.writeFileSync(filePath, newContent);
        console.log('Reverted hover color in: ' + filePath);
    }
});
