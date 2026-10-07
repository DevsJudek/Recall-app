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
    const codes = ['PUL 301', 'PUL 303', 'BUL 301', 'JPL 303', 'JPL 201', 'PUL 201', 'PUL 203', 'JPL 301', 'BUL 303', 'AGR 201'];
    for (const code of codes) {
        const { data: q } = await supabase.from('questions').select('topic').eq('course_code', code).limit(1);
        if (q && q.length > 0) console.log(code, '->', q[0].topic);
    }
}
run();
