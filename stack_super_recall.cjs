const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

// Find the start of the Class Rank block
const classRankStart = content.indexOf('<div className="border border-[#E5E5E5] dark:border-gray-800 bg-white dark:bg-[#1A1A1A] rounded-[24px]');

// Find the start of Super Recall block
const superRecallStart = content.indexOf('<div className="mt-6 max-w-3xl mx-auto w-full relative">');
const endOfComponent = content.lastIndexOf('</div>\n    );\n  }');

if (classRankStart !== -1 && superRecallStart !== -1) {
    const classRankHtml = content.substring(classRankStart, superRecallStart).trim();
    // Remove the extra closing </div> that closes the grid before super recall
    const cleanClassRankHtml = classRankHtml.replace(/<\/div>$/, '').trim();
    
    // We want the new structure to be:
    // (Inside grid)
    // <div className="flex flex-col gap-4 md:gap-6 w-full">
    //    [Super Recall Html]
    //    [Class Rank Html]
    // </div>
    // </div> (Closing grid)
    
    const superRecallReplacement = `
            <div className="relative h-full w-full rounded-[32px] border border-[#E5E5E5] dark:border-gray-800 p-1 md:p-1.5 flex-1 shadow-sm hover:shadow-md transition-shadow">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[24px] bg-[#0a0a0a] p-4 md:p-5 shadow-lg">
                <div className="flex items-center justify-between relative z-20">
                  <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Subscription</div>
                  <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Active</div>
                </div>
                <div className="relative z-20 flex-1">
                  <h3 className="text-2xl font-black tracking-tight text-white mb-2 flex items-center gap-2">Super Recall <span className="text-[8px] font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 rounded-md uppercase">BETA</span></h3>
                  <p className="text-sm font-medium text-gray-400">
                    You have full access to unlimited practice and explanations.
                  </p>
                </div>
                <button className="w-fit mt-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-bold text-sm rounded-[14px] transition-colors shadow-sm relative z-20">
                  Manage Sub
                </button>
              </div>
            </div>`;
            
    const newHtml = `
          <div className="flex flex-col gap-4 md:gap-6 w-full">
            ${superRecallReplacement}
            
            ${cleanClassRankHtml.replace('</div>\n              </div>', '</div>\n          </div>')}
          </div>
        </div>`;

    // Reconstruct file
    content = content.substring(0, classRankStart) + newHtml + content.substring(endOfComponent);
    fs.writeFileSync(file, content);
    console.log('Successfully stacked Super Recall ON TOP of Class Rank!');
} else {
    console.log('Could not find indices.');
}
