const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
if (!content.includes('import { CardSpotlight }')) {
  content = content.replace(
    "import { supabase } from './supabase';",
    "import { supabase } from './supabase';\nimport { CardSpotlight } from './components/ui/card-spotlight';"
  );
}

// 2. Replace the Super Recall card div with CardSpotlight
const oldCardRegex = /<div className="p-10 md:p-12 rounded-\[32px\] bg-gray-100 dark:bg-\[#1a1a1a\] flex flex-col h-full relative border-none">/g;

content = content.replace(
  oldCardRegex,
  '<CardSpotlight className="p-10 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#1a1a1a] flex flex-col h-full relative border-none">'
);

// Close tag: since the inner content is wrapped, we just need to replace the closing </div> of that FadeIn block
// But wait! There are two pricing cards. The first one is the "Free" card, the second is the "Super Recall" card.
// Wait, my regex matches BOTH if they have the same class?
// No, the Free card has `bg-[#f8f9fa] dark:bg-[#0f0f0f]`. The Super Recall card has `bg-gray-100 dark:bg-[#1a1a1a]`.
// So the regex only matches the Super Recall card!
// We need to replace the closing </div> of that specific card.
// Let's use a simpler substring replace for the entire Super Recall card.

const superRecallBlock = `<FadeIn delay={300}>
                <div className="p-10 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#1a1a1a] flex flex-col h-full relative border-none">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Super Recall</div>
                    <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Recommended</div>
                  </div>
                  <div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2">₦3,500</div>
                  <div className="text-[14px] font-medium text-gray-500 mb-6">Per semester</div>
                  <div className="text-[14px] leading-[1.6] text-gray-600 dark:text-gray-400 mb-10 max-w-[280px]">Unlimited practice, deep explanations, offline mode, and zero restrictions.</div>
                  
                  <ul className="space-y-4 mb-20 flex-1">
                    {['Full access to your class course library', 'Unlimited daily ranked tests', 'Detailed answer explanations', 'Priority community access'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[14px] text-gray-700 dark:text-gray-400">
                        <svg className="shrink-0 mt-[2px] text-gray-900 dark:text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-[12px] font-medium text-[14px] hover:bg-[#E56000] transition-colors shadow-sm mt-auto">
                    Get Super Recall <ArrowUpRight size={16} />
                  </button>
                  <p className="mt-5 text-[12px] text-gray-500 dark:text-gray-500 max-w-[250px] leading-relaxed">
                    Offline mode comes with our native Android and iOS builds which will be in development soon.
                  </p>
                </div>
              </FadeIn>`;

const newSuperRecallBlock = `<FadeIn delay={300} className="h-full">
                <CardSpotlight className="p-10 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#1a1a1a] flex flex-col h-full relative border border-gray-200 dark:border-white/5">
                  <div className="flex items-center justify-between mb-8 relative z-20">
                    <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Super Recall</div>
                    <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Recommended</div>
                  </div>
                  <div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2 relative z-20">₦3,500</div>
                  <div className="text-[14px] font-medium text-gray-500 mb-6 relative z-20">Per semester</div>
                  <div className="text-[14px] leading-[1.6] text-gray-600 dark:text-gray-400 mb-10 max-w-[280px] relative z-20">Unlimited practice, deep explanations, offline mode, and zero restrictions.</div>
                  
                  <ul className="space-y-4 mb-20 flex-1 relative z-20">
                    {['Full access to your class course library', 'Unlimited daily ranked tests', 'Detailed answer explanations', 'Priority community access'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[14px] text-gray-700 dark:text-gray-400">
                        <svg className="shrink-0 mt-[2px] text-gray-900 dark:text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-[12px] font-medium text-[14px] hover:bg-[#E56000] transition-colors shadow-sm mt-auto relative z-20">
                    Get Super Recall <ArrowUpRight size={16} />
                  </button>
                  <p className="mt-5 text-[12px] text-gray-500 dark:text-gray-500 max-w-[250px] leading-relaxed relative z-20">
                    Offline mode comes with our native Android and iOS builds which will be in development soon.
                  </p>
                </CardSpotlight>
              </FadeIn>`;

// Since I just used a simple replace with the exact block above earlier, let's verify if replacing works or if I need to do a regex.
// I will just use regex to wrap the Super Recall card specifically.

// Fallback regex approach:
const fullContent = fs.readFileSync(file, 'utf8');
const startToken = '<div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Super Recall</div>';
const startIndex = fullContent.indexOf(startToken);

if (startIndex !== -1) {
    // Find the enclosing div
    const divStart = fullContent.lastIndexOf('<div', startIndex);
    const fadeStart = fullContent.lastIndexOf('<FadeIn', divStart);
    // Find the end
    const cardEnd = fullContent.indexOf('</div>\n              </FadeIn>', divStart) + '</div>'.length;
    
    let toReplace = fullContent.slice(divStart, cardEnd);
    let replaced = toReplace.replace(/<div (className="p-10[^>]+)>/, '<CardSpotlight $1>');
    replaced = replaced.replace(/<\/div>$/, '</CardSpotlight>');
    
    // add a subtle border back to it to catch the spotlight nicely
    replaced = replaced.replace('border-none', 'border border-gray-200 dark:border-white/5');

    const finalContent = fullContent.slice(0, divStart) + replaced + fullContent.slice(cardEnd);
    fs.writeFileSync(file, finalContent);
    console.log('CardSpotlight applied successfully via targeted replace!');
} else {
    console.log('Could not find Super Recall card to replace.');
}

