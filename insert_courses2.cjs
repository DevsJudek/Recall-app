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
        { code: 'PUL 205', title: 'Human Rights I', level: '200L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true, topics_count: 0, pq_count: 0 },
        { code: 'JPL 303', title: 'Family Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true, topics_count: 0, pq_count: 0 },
        { code: 'BUL 305', title: 'Labour Law I', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true, topics_count: 0, pq_count: 0 },
        { code: 'PUL 303', title: 'Labour Law (Alternative)', level: '300L', department: 'Law', type: 'Core Elective', semester: '1st Semester', is_available: true, topics_count: 0, pq_count: 0 } 
    ];

    for (const c of coursesToInsert) {
        const { data: existing } = await supabase.from('courses').select('id').eq('code', c.code);
        if (existing && existing.length > 0) {
            console.log(c.code + ' already exists');
        } else {
            const { error } = await supabase.from('courses').insert([c]);
            if (error) console.log('Error inserting ' + c.code, error);
            else console.log('Inserted ' + c.code);
        }
    }
}
run();
