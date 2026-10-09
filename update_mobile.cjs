const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldHeroMockup = `{/* Hero Mockup Composition */}
          <div className="relative w-full max-w-5xl h-[500px] md:h-[700px] opacity-0 animate-world-arrive mt-4 flex justify-center items-start perspective-1000" style={{ animationDelay: '0.4s' }}>
             <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B00]/10 to-transparent rounded-full blur-3xl opacity-50 -top-32 pointer-events-none"></div>
             
             {/* Left Phone */}
             <div className="absolute left-0 md:left-[10%] top-12 w-48 md:w-64 transform -rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 drop-shadow-2xl z-10 hidden sm:block">
               <img src="/mockups/courses.png" alt="Courses" className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
             </div>

             {/* Center Phone */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 w-64 md:w-80 transform hover:-translate-y-6 transition-transform duration-700 z-30">
               <img src="/mockups/quiz.png" alt="Quiz" className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(255,107,0,0.3)]" />
             </div>

             {/* Right Phone */}
             <div className="absolute right-0 md:right-[10%] top-24 w-48 md:w-64 transform rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 drop-shadow-2xl z-20 hidden sm:block">
               <img src="/mockups/leaderboard.png" alt="Leaderboard" className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
             </div>
          </div>`;

const newHeroMockup = `{/* Hero Mockup Composition */}
          <div className="relative w-full max-w-5xl h-[350px] sm:h-[450px] md:h-[700px] opacity-0 animate-world-arrive mt-4 flex justify-center items-start perspective-1000 overflow-hidden md:overflow-visible" style={{ animationDelay: '0.4s' }}>
             <div className="absolute inset-0 bg-gradient-to-b from-[#FF6B00]/10 to-transparent rounded-full blur-3xl opacity-50 -top-32 pointer-events-none"></div>
             
             {/* Left Phone */}
             <div className="absolute left-[-20px] sm:left-0 md:left-[10%] top-8 md:top-12 w-32 sm:w-48 md:w-64 transform -rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 drop-shadow-2xl z-10">
               <img src="/mockups/courses.png" alt="Courses" className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
             </div>

             {/* Center Phone */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 w-44 sm:w-64 md:w-80 transform hover:-translate-y-6 transition-transform duration-700 z-30">
               <img src="/mockups/quiz.png" alt="Quiz" className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(255,107,0,0.3)]" />
             </div>

             {/* Right Phone */}
             <div className="absolute right-[-20px] sm:right-0 md:right-[10%] top-16 md:top-24 w-32 sm:w-48 md:w-64 transform rotate-12 translate-y-12 hover:-translate-y-4 transition-transform duration-700 drop-shadow-2xl z-20">
               <img src="/mockups/leaderboard.png" alt="Leaderboard" className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" />
             </div>
          </div>`;

content = content.replace(oldHeroMockup, newHeroMockup);
fs.writeFileSync(file, content);
console.log('Update script completed successfully!');
