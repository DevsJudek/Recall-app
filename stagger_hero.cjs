const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the start of the Hero text wrapper
content = content.replace(
  '<FadeIn delay={100} className="max-w-4xl">',
  '<div className="max-w-4xl">\n            <FadeIn delay={100}>'
);

// Replace paragraph start to end FadeIn and start new
content = content.replace(
  '<h1 className="text-[40px]',
  '</FadeIn>\n            <FadeIn delay={200}>\n              <h1 className="text-[40px]'
);

content = content.replace(
  '<p className="text-[18px]',
  '</FadeIn>\n            <FadeIn delay={300}>\n              <p className="text-[18px]'
);

content = content.replace(
  '<div className="flex flex-col sm:flex-row',
  '</FadeIn>\n            <FadeIn delay={400}>\n              <div className="flex flex-col sm:flex-row'
);

// The end of the buttons div should just close the wrapper div because it was already closing the original FadeIn
content = content.replace(
  'Explore the library\n              </button>\n            </div>\n          </FadeIn>',
  'Explore the library\n              </button>\n            </div>\n            </FadeIn>\n          </div>'
);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
