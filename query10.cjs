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
    const { data: q } = await supabase.from('questions').select('course_code');
    const uniqueCodes = new Set(q.map(x => x.course_code));
    console.log('Unique course codes in questions:', Array.from(uniqueCodes));
}
run();
