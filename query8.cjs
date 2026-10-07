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
    const { data: q } = await supabase.from('questions').select('topic').eq('course_code', 'PUL 201');
    const topicsMap = {};
    q.forEach(x => {
        topicsMap[x.topic] = (topicsMap[x.topic] || 0) + 1;
    });
    console.log('Constitutional Law (PUL 201) questions:', q.length);
    console.log('Topics:', topicsMap);
}
run();
