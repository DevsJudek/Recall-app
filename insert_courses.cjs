const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const coursesToInsert = [
        { code: 'PUL 205', title: 'Human Rights I', level: '200L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true, topics_count: 5, pq_count: 50 },
        { code: 'JPL 303', title: 'Family Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true, topics_count: 5, pq_count: 50 },
        { code: 'BUL 305', title: 'Labour Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true, topics_count: 5, pq_count: 50 }
    ];

    const { data, error } = await supabase.from('courses').upsert(coursesToInsert, { onConflict: 'code' });
    if (error) console.error('Error:', error);
    else console.log('Successfully inserted courses!');
}
run();
