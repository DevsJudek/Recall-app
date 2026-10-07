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
        const { data } = await supabase.from('questions').select('course_code, topic, question_text').range(from, from + 999);
        if (!data || data.length === 0) break;
        allQ = allQ.concat(data);
        from += 1000;
    }
    const codes = new Set(allQ.map(x => x.course_code));
    console.log('Unique course codes:', Array.from(codes));

    const hr = allQ.filter(x => x.course_code.toLowerCase().includes('human') || x.topic.toLowerCase().includes('human') || (x.question_text && x.question_text.toLowerCase().includes('human right')));
    if (hr.length > 0) {
        console.log('Human rights found in course:', hr[0].course_code, 'Topic:', hr[0].topic);
    }
}
run();
