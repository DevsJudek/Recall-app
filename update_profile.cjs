const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\pages\\Profile.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { GlowingEffect }')) {
  content = content.replace(
    'export default function Profile({',
    'import { GlowingEffect } from "../components/ui/glowing-effect";\n\nexport default function Profile({'
  );
}

const superRecallSection = `
      <div className="mt-6 max-w-3xl mx-auto w-full relative">
        <div className="relative h-full rounded-[32px] border border-gray-200 dark:border-gray-800 p-2 md:p-3">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-[24px] bg-[#f8f9fa] dark:bg-[#0a0a0a] p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500">Subscription</div>
              <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#FF6B00] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-3 py-1 rounded-full">Active</div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-[#1A1A1A] dark:text-white mb-2">Super Recall</h3>
              <p className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-400">
                You have full access to unlimited practice, deep explanations, and the complete course library.
              </p>
            </div>
            <button className="w-fit mt-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#E56000] text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(
  '      </div>\n    </div>\n  );\n}',
  '      </div>' + superRecallSection
);

fs.writeFileSync(file, content);
console.log('Super Recall section added to Profile.jsx');
