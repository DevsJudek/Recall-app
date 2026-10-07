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
    const { data: q } = await supabase.from('questions').select('course_code, question_text, topic').limit(200);
    const hr = q.filter(x => x.question_text && x.question_text.toLowerCase().includes('human right'));
    if (hr.length > 0) {
        console.log('Found in questions! Course code:', hr[0].course_code);
    } else {
        console.log('Not found in first 200 questions.');
    }
}
run();
