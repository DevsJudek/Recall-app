const fs = require('fs');

function patchDropdown(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    const regex = /<div className="pointer-events-none absolute right-4 top-1\/2 -translate-y-1\/2 text-gray-400">[\s\S]*?<\/div>/;

    const newIcon = `<div 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#FF6B00] transition-colors p-2 flex items-center justify-center z-10"
                  onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isOpen) {
                          setIsOpen(false);
                          setSearch('');
                      } else {
                          setSearch('');
                          setIsOpen(true);
                      }
                  }}
              >
                  <svg className={\`w-4 h-4 transition-transform \${isOpen ? 'rotate-180' : ''}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>`;

    if (regex.test(content)) {
        content = content.replace(regex, newIcon);
        fs.writeFileSync(file, content);
        console.log('Patched ' + file);
    } else {
        console.log('Not found in ' + file);
    }
}

patchDropdown('C:\\Users\\kolaw\\recall-app\\src\\pages\\EditProfile.jsx');
patchDropdown('C:\\Users\\kolaw\\recall-app\\src\\pages\\Onboarding.jsx');
