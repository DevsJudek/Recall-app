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
    // 1. Rename JPL 303 to JPL 305 in questions
    const { data: q1, error: e1 } = await supabase.from('questions').update({ course_code: 'JPL 305' }).eq('course_code', 'JPL 303');
    console.log('JPL 303 -> JPL 305 in questions:', e1 || 'Success');

    // 2. Rename PUL 303 to BUL 305 in questions
    const { data: q2, error: e2 } = await supabase.from('questions').update({ course_code: 'BUL 305' }).eq('course_code', 'PUL 303');
    console.log('PUL 303 -> BUL 305 in questions:', e2 || 'Success');

    // 3. Rename JPL 303 to JPL 305 in module_readings
    const { data: m1, error: e3 } = await supabase.from('module_readings').update({ course_code: 'JPL 305' }).eq('course_code', 'JPL 303');
    console.log('JPL 303 -> JPL 305 in module_readings:', e3 || 'Success');

    // 4. Rename PUL 303 to BUL 305 in module_readings
    const { data: m2, error: e4 } = await supabase.from('module_readings').update({ course_code: 'BUL 305' }).eq('course_code', 'PUL 303');
    console.log('PUL 303 -> BUL 305 in module_readings:', e4 || 'Success');
}
run();
