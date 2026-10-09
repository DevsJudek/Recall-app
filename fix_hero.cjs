const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Scale down the h1 text
content = content.replace(
  'className="text-[48px] md:text-[80px]',
  'className="text-[40px] md:text-[72px]'
);

// 2. Replace hardcoded animate-center-arrive with FadeIn
content = content.replace(
  '<div className="opacity-0 animate-center-arrive max-w-4xl" style={{ animationDelay: \'0.1s\' }}>',
  '<FadeIn delay={100} className="max-w-4xl">'
);

// Close the FadeIn tag properly (replacing the closing div of that container)
content = content.replace(
  'Explore the library\n              </button>\n            </div>\n          </div>',
  'Explore the library\n              </button>\n            </div>\n          </FadeIn>'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
