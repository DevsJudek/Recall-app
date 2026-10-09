const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Rebuild Grid
const gridStart = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">';
const gridEnd = '</section>';
const gridStartIndex = content.indexOf(gridStart);
const gridEndIndex = content.indexOf(gridEnd, gridStartIndex);

if (gridStartIndex !== -1 && gridEndIndex !== -1) {
  const newGrid = `
          <FadeIn delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-[24px] overflow-hidden mt-8">
              {['Commercial Law', 'Criminal Law', 'Law of Torts', 'Anatomy', 'Physiology', 'GST 101'].map((topic, idx) => (
                <div key={topic} onClick={onLoginClick} className="group flex justify-between items-center p-6 md:p-8 bg-[#f8f9fa] dark:bg-[#0a0a0a] hover:bg-white dark:hover:bg-[#141414] transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
                    </div>
                    <span className="font-medium text-[17px] text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">{topic}</span>
                  </div>
                  <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={400}>
            <button onClick={onLoginClick} className="flex items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-[16px] font-medium text-[15px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mt-8">
              Explore 100 topics <ArrowUpRight size={18} />
            </button>
          </FadeIn>
        `;
  content = content.substring(0, gridStartIndex) + newGrid + content.substring(gridEndIndex);
}

// 2. Rebuild Pricing Section
const pricingStart = '<section id="pricing" className="max-w-4xl mx-auto">';
const pricingEnd = '{/* FAQ SECTION */}';
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
                <div className="p-8 md:p-12 rounded-[32px] bg-[#f8f9fa] dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 flex flex-col h-full relative">
                  <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-8">Free</div>
                  <div className="text-[56px] font-semibold leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2">₦0</div>
                  <div className="text-[15px] font-medium text-gray-500 mb-8">Start here</div>
                  <div className="text-[16px] leading-relaxed text-gray-600 dark:text-gray-400 mb-10">Study basic topics, track your simple streaks, and compete on the global leaderboard.</div>
                  
                  <ul className="space-y-4 mb-16 flex-1">
                    {['Limited high yield summaries', '3 daily ranked tests', 'Basic performance analytics', 'Global leaderboard access', 'Standard community support'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[15px] text-gray-700 dark:text-gray-300 font-medium">
                        <svg className="shrink-0 mt-0.5 text-gray-900 dark:text-white" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    Start free <ArrowUpRight size={18} />
                  </button>
                </div>
              </FadeIn>

              <FadeIn delay={300}>
                <div className="p-8 md:p-12 rounded-[32px] bg-gray-100 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 flex flex-col h-full relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-xs font-bold tracking-widest uppercase text-gray-500">Super Recall</div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Unlimited</div>
                  </div>
                  <div className="text-[56px] font-semibold leading-none tracking-[-0.04em] text-gray-900 dark:text-white mb-2">₦3,500</div>
                  <div className="text-[15px] font-medium text-gray-500 mb-8">Per semester</div>
                  <div className="text-[16px] leading-relaxed text-gray-600 dark:text-gray-400 mb-10">Unlimited practice, deep explanations, offline mode, and zero restrictions.</div>
                  
                  <ul className="space-y-4 mb-16 flex-1">
                    {['Full access to all course libraries', 'Unlimited daily ranked tests', 'Detailed answer explanations', 'Offline mode support', 'Priority community access', 'No automatic renewal'].map(feature => (
                      <li key={feature} className="flex gap-4 items-start text-[15px] text-gray-700 dark:text-gray-300 font-medium">
                        <svg className="shrink-0 mt-0.5 text-gray-900 dark:text-white" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button onClick={onLoginClick} className="w-fit flex items-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-[14px] font-medium text-[15px] hover:bg-[#E56000] transition-colors shadow-md">
                    Get Super Recall <ArrowUpRight size={18} />
                  </button>
                  <p className="mt-6 text-[13px] text-gray-500 dark:text-gray-500 max-w-[250px] leading-relaxed">
                    Buy one semester of Super Recall. No automatic renewal.
                  </p>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={400}>
              <div className="mt-12 bg-[#f8f9fa] dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-[32px] overflow-hidden">
                <div className="p-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-[17px] font-medium text-gray-900 dark:text-white">Compare plans.</h3>
                </div>
                <table className="w-full text-left text-[14px]">
                  <thead className="text-[13px] font-medium text-gray-500 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="font-medium p-4 pl-8 w-1/2">Features</th>
                      <th className="font-medium p-4 text-left">Free</th>
                      <th className="font-medium p-4 text-left">Super Recall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {[
                      ['Access to Library', 'Limited', 'Unlimited'],
                      ['Daily Ranked Tests', '3 / day', 'Unlimited'],
                      ['High yield summaries', 'Limited', 'Full Access'],
                      ['Global Leaderboard', 'Included', 'Included'],
                      ['Performance Analytics', 'Basic', 'Advanced'],
                      ['Offline Mode', 'No', 'Yes']
                    ].map(([label, free, plus], i) => (
                      <tr key={i} className="hover:bg-white dark:hover:bg-[#141414] transition-colors">
                        <td className="p-4 pl-8 py-5 font-medium text-gray-800 dark:text-gray-200">{label}</td>
                        <td className="p-4 py-5 text-left text-gray-600 dark:text-gray-400 font-medium">{free}</td>
                        <td className="p-4 py-5 text-left text-[#FF6B00] font-semibold">{plus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </section>

          `;
  content = content.substring(0, pricingStartIndex) + newPricing + content.substring(pricingEndIndex);
}

// 3. Align Mockups
content = content.replace(
  'absolute right-[-20px] sm:right-0 md:right-[10%] top-16 md:top-24',
  'absolute right-[-20px] sm:right-0 md:right-[10%] top-8 md:top-12'
);

// 4. Remove Border on Second CTA Button in Hero
// It was: bg-transparent border-2 border-[#FF6B00] text-[#FF6B00]
content = content.replace(
  'bg-transparent border-2 border-[#FF6B00] text-[#FF6B00]',
  'bg-transparent text-[#FF6B00]'
);

fs.writeFileSync(file, content);
console.log('Master update script completed successfully!');
