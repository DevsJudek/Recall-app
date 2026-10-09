import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function checkModules() {
  let { data: pulData } = await supabase.from('module_readings').select('course_code, topic').in('course_code', ['PUL 303']);
  let { data: bulData } = await supabase.from('module_readings').select('course_code, topic').in('course_code', ['BUL 301', 'BUL 305']);

  const groupData = (data) => {
      const grouped = {};
      data.forEach(row => {
          const key = `${row.course_code} - ${row.topic}`;
          grouped[key] = (grouped[key] || 0) + 1;
      });
      return grouped;
  };

  console.log("\nLabour Law (PUL 303) Modules:");
  console.log(groupData(pulData || []));

  console.log("\nCommercial Law Modules:");
  console.log(groupData(bulData || []));
}

checkModules();
