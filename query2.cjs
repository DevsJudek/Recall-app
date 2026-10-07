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
    const { data: q } = await supabase.from('questions').select('course_code, topic').ilike('topic', '%Human Rights%');
    console.log('Questions with Human Rights topic:', q);

    const { data: courses } = await supabase.from('courses').select('*');
    const hr = courses.filter(c => c.title.toLowerCase().includes('human'));
    console.log('Courses with Human in title:', hr);

    const { data: pul204 } = await supabase.from('courses').select('*').eq('code', 'PUL 204');
    console.log('PUL 204:', pul204);
}
run();
