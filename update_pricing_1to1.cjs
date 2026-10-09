const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const pricingStart = '<section id="pricing" className="max-w-5xl mx-auto mt-32">';
const pricingEnd = '              <FadeIn delay={400}>';
const pricingStartIndex = content.indexOf(pricingStart);
const pricingEndIndex = content.indexOf(pricingEnd, pricingStartIndex);

if (pricingStartIndex !== -1 && pricingEndIndex !== -1) {
  const newPricing = `
          <section id="pricing" className="max-w-5xl mx-auto mt-32">
            <FadeIn>
              <div className="flex flex-col md:flex-row gap-16 items-start">
                <div className="flex-1">
                  <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold mb-6 tracking-[-0.03em] text-gray-900 dark:text-white">Start free.<br/>Do more with Super Recall.</h2>
                </div>
                <div className="flex-[1.2]">
                  <p className="text-[18px] text-gray-600 dark:text-gray-400">Join thousands of students and start studying for free. Super Recall gives you full access to unlimited practice and explanations to maximize your grades.</p>
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
              <FadeIn delay={200}>
                <div className="p-10 md:p-12 rounded-[32px] bg-[#f8f9fa] dark:bg-[#0f0f0f] flex flex-col h-full relative">
                  <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-8">Free</div>
                  <div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2">₦0</div>
                  <div className="text-[14px] font-medium text-gray-500 mb-6">Start here</div>
                  <div className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400 mb-10 max-w-[280px]">Study basic topics, track your simple streaks, and compete on the global leaderboard.</div>
                  
                  <ul className="space-y-4 mb-20 flex-1">
                    {['Limited high yield summaries', '3 daily ranked tests', 'Basic performance analytics', 'Global leaderboard access', 'Standard community support'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[14px] text-gray-700 dark:text-gray-300">
                        <svg className="shrink-0 mt-[2px] text-gray-900 dark:text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-5 py-2.5 rounded-xl font-medium text-[14px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    Start free <ArrowUpRight size={16} />
                  </button>
                </div>
              </FadeIn>

              <FadeIn delay={300}>
                <div className="p-10 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#1a1a1a] flex flex-col h-full relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Super Recall</div>
                    <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Unlimited</div>
                  </div>
                  <div className="text-[64px] font-medium leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2">₦3,500</div>
                  <div className="text-[14px] font-medium text-gray-500 mb-6">Per semester</div>
                  <div className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400 mb-10 max-w-[280px]">Unlimited practice, deep explanations, offline mode, and zero restrictions.</div>
                  
                  <ul className="space-y-4 mb-20 flex-1">
                    {['Full access to all course libraries', 'Unlimited daily ranked tests', 'Detailed answer explanations', 'Offline mode support', 'Priority community access', 'No automatic renewal'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[14px] text-gray-700 dark:text-gray-300">
                        <svg className="shrink-0 mt-[2px] text-gray-900 dark:text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-[#FF6B00] text-white px-5 py-2.5 rounded-xl font-medium text-[14px] hover:bg-[#E56000] transition-colors shadow-sm">
                    Get Super Recall <ArrowUpRight size={16} />
                  </button>
                  <p className="mt-5 text-[12px] text-gray-500 dark:text-gray-500 max-w-[250px] leading-relaxed">
                    Buy one semester of Super Recall. No automatic renewal.
                  </p>
                </div>
              </FadeIn>
            </div>

`;
  
  content = content.substring(0, pricingStartIndex) + newPricing + content.substring(pricingEndIndex);
  fs.writeFileSync(file, content);
  console.log('Pricing 1:1 script completed successfully!');
} else {
  console.log('Markers not found!');
}
