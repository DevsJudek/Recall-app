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
    const { data: courses } = await supabase.from('courses').select('*');
    const hr = courses.filter(c => c.title.toLowerCase().includes('human') || c.title.toLowerCase().includes('right'));
    console.log('Courses with Human or Right:', hr);
}
run();
