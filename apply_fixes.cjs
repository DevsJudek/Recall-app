const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Capitalize Recall in Header
content = content.replace(
  '<img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-6 h-6 object-contain" />\n            recall',
  '<img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-6 h-6 object-contain" />\n            Recall'
);

// 2. Capitalize Recall in Footer
content = content.replace(
  '<img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-6 h-6 object-contain" />\n              recall',
  '<img src="/mockups/recall-logo.png" alt="Recall Logo" className="w-6 h-6 object-contain" />\n              Recall'
);

// 3. Capitalize Recall in Giant Footer
content = content.replace(
  '<h1 className="text-[15vw] font-bold leading-none tracking-tighter text-[#FF6B00]/10 select-none">recall</h1>',
  '<h1 className="text-[15vw] font-bold leading-none tracking-tighter text-[#FF6B00]/10 select-none">Recall</h1>'
);

// 4. Fix Features Interactive Section Layout
const oldFeaturesContainer = `<div className="flex-1 w-full flex justify-center items-center h-[500px] md:h-[700px]">
             <div className="relative w-64 md:w-80 h-full flex items-center justify-center">
               <div className="absolute inset-0 bg-[#FF6B00]/20 blur-[100px] rounded-full scale-110 pointer-events-none"></div>
               {features.map((feature, idx) => (
                 <img 
                   key={idx}
                   src={feature.img} 
                   alt={feature.title} 
                   className={\`absolute top-1/2 -translate-y-1/2 left-0 w-full h-auto object-contain drop-shadow-2xl transition-all duration-700 \${
                     activeFeature === idx ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 translate-y-8 z-0 pointer-events-none'
                   }\`} 
                 />
               ))}
             </div>
          </div>`;

const newFeaturesContainer = `<div className="flex-1 w-full flex justify-center items-center relative py-12">
             <div className="relative w-64 md:w-80 flex items-center justify-center">
               <div className="absolute inset-0 bg-[#FF6B00]/20 blur-[100px] rounded-full scale-110 pointer-events-none"></div>
               <img src={features[0].img} className="w-full h-auto invisible" aria-hidden="true" />
               {features.map((feature, idx) => (
                 <img 
                   key={idx}
                   src={feature.img} 
                   alt={feature.title} 
                   className={\`absolute top-0 left-0 w-full h-full object-contain drop-shadow-2xl transition-all duration-700 \${
                     activeFeature === idx ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-95 translate-y-8 z-0 pointer-events-none'
                   }\`} 
                 />
               ))}
             </div>
          </div>`;

content = content.replace(oldFeaturesContainer, newFeaturesContainer);

// 5. Fix Pocket Companion gradient and position
const oldPocketCompanion = `<div className="flex-1 w-full flex justify-center items-center">
                <img src="/mockups/profile.png" alt="Recall App on Mobile" className="w-full max-w-[450px] h-auto object-contain drop-shadow-2xl transform md:rotate-[-5deg]" />
             </div>`;

const newPocketCompanion = `<div className="flex-1 w-full flex justify-center items-center relative">
                <div className="relative w-full max-w-[450px]">
                  <img src="/mockups/profile.png" alt="Recall App on Mobile" className="w-full h-auto object-contain drop-shadow-2xl transform md:rotate-[-5deg]" />
                  <div className="absolute bottom-[-10px] left-[-20px] right-[-20px] h-48 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none transform md:rotate-[-5deg]"></div>
                </div>
             </div>`;

content = content.replace(oldPocketCompanion, newPocketCompanion);

fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
