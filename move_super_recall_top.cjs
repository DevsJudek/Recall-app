const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

// The original Super Recall string we want to remove from the bottom
const superRecallStr = `        <div className="mt-6 max-w-3xl mx-auto w-full relative">
          <div className="relative h-full rounded-[32px] border border-[#E5E5E5] dark:border-gray-800 p-1 md:p-1.5">
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
              <div className="relative z-20">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-2 md:gap-3">Super Recall <span className="text-[8px] md:text-xs font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md uppercase mt-0.5 md:mt-0">BETA</span></h3>
                <p className="text-sm md:text-base font-medium text-gray-400">
                  You have full access to unlimited practice, deep explanations, and the complete course library.
                </p>
              </div>
              <button className="w-fit mt-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-bold text-sm rounded-[14px] transition-colors shadow-sm relative z-20">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>`;

// The replacement containing Super Recall ON TOP, then Class Rank
const replacement = `          <div className="flex flex-col gap-4 md:gap-6 w-full">
            <div className="relative h-full w-full rounded-[32px] border border-[#E5E5E5] dark:border-gray-800 p-1 md:p-1.5 flex-1">
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
                  <h3 className="text-2xl md:text-2xl font-black tracking-tight text-white mb-2 flex items-center gap-2">Super Recall <span className="text-[8px] font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 rounded-md uppercase">BETA</span></h3>
                  <p className="text-sm font-medium text-gray-400">
                    You have full access to unlimited practice and explanations.
                  </p>
                </div>
                <button className="w-fit mt-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-bold text-sm rounded-[14px] transition-colors shadow-sm relative z-20">
                  Manage Sub
                </button>
              </div>
            </div>

            <div className="border border-[#E5E5E5] dark:border-gray-800 bg-white dark:bg-[#1A1A1A] rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#FFF9F5] dark:bg-[#242424] rounded-2xl flex items-center justify-center text-2xl border border-[#FFE8D6] dark:border-transparent">📈</div>
                <div>
                  <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Class Rank</p>
                  <p className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white text-left">{classRank}</p>
                </div>
              </div>
            </div>
          </div>`;

let normalizedContent = content.replace(/\r/g, '');

if (normalizedContent.includes(superRecallStr.replace(/\r/g, ''))) {
    normalizedContent = normalizedContent.replace(superRecallStr.replace(/\r/g, ''), '');
    
    const classRankRegex = /<div className="border border-\[#E5E5E5\][^>]+>[\s\S]*?<div className="flex items-center gap-4">[\s\S]*?<div[^>]+>📈<\/div>[\s\S]*?<div>[\s\S]*?<p[^>]+>Class Rank<\/p>[\s\S]*?<p[^>]+>\{classRank\}<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
    
    if (classRankRegex.test(normalizedContent)) {
        content = normalizedContent.replace(classRankRegex, replacement);
        fs.writeFileSync(file, content);
        console.log('Moved Super Recall ON TOP of Class Rank!');
    } else {
        console.log('Could not find Class Rank block via regex.');
    }
} else {
    console.log('Could not find Super Recall string.');
}
