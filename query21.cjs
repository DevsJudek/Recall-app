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
    let allQ = [];
    let from = 0;
    while (true) {
        const { data } = await supabase.from('questions').select('course_code').range(from, from + 999);
        if (!data || data.length === 0) break;
        allQ = allQ.concat(data);
        from += 1000;
    }
    const codes = new Set(allQ.map(x => x.course_code));
    console.log('Unique course codes:', Array.from(codes));
}
run();
