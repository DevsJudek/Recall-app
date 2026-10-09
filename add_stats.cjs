const fs = require('fs');
const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add supabase import if not present
if (!content.includes("import { supabase } from './supabase';")) {
  content = content.replace(
    "import React, { useEffect, useState, useRef } from 'react';",
    "import React, { useEffect, useState, useRef } from 'react';\nimport { supabase } from './supabase';"
  );
}

// 2. Add state and useEffect to LandingPage component
const componentStart = 'export default function LandingPage({ onLoginClick }) {';
const statsCode = `
  const [stats, setStats] = useState({ students: 0, courses: 0, questions: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: studentsCount },
          { count: coursesCount },
          { count: questionsCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('questions').select('*', { count: 'exact', head: true })
        ]);
        setStats({
          students: studentsCount || 0,
          courses: coursesCount || 0,
          questions: questionsCount || 0
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    }
    fetchStats();
  }, []);
`;

content = content.replace(componentStart, componentStart + '\n' + statsCode);

// 3. Inject the stats block under the buttons
const buttonsBlockEnd = 'Explore the library\n              </button>\n            </div>';
const newStatsBlock = `Explore the library
              </button>
            </div>
            </FadeIn>
            
            <FadeIn delay={500}>
              <div className="flex items-center justify-center gap-6 md:gap-16 mb-24 mt-[-20px] text-gray-500 dark:text-gray-400 opacity-90">
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.students.toLocaleString()}+</span>
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">Students</span>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.courses.toLocaleString()}</span>
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">Courses</span>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-800"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.questions.toLocaleString()}+</span>
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">MCQs</span>
                </div>
              </div>`;

content = content.replace(buttonsBlockEnd, newStatsBlock);

// 4. Reduce bottom margin on the buttons div to tighten it up
content = content.replace(
  'className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"',
  'className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"'
);

fs.writeFileSync(file, content);
console.log('Stats injection script completed successfully!');
