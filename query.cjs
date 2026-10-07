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
    const { data: hr } = await supabase.from('courses').select('*').ilike('title', '%Human Rights%');
    console.log('Human Rights Courses:', hr);

    const { data: consLawCourses } = await supabase.from('courses').select('code, title').ilike('title', '%Constitutional%');
    console.log('Constitutional Law Courses:', consLawCourses);

    for (const c of consLawCourses) {
        const { data: topics } = await supabase.from('questions').select('topic').eq('course_code', c.code);
        const uniqueTopics = new Set((topics || []).map(t => t.topic));
        console.log('Topics for ' + c.code + ':', uniqueTopics.size, Array.from(uniqueTopics));
    }
}
run();
