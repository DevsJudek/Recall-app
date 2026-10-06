const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function fix() {
    // Delete the 15 dummy questions I added
    const dummyQuestions = [
        'An invitation to treat is:',
        'Which of the following is the standard test for intention to create legal relations in commercial agreements?',
        'Past consideration is generally:',
        'The postal rule states that acceptance is complete when:',
        'Performance of an existing public duty is:',
        'A constitution that cannot be easily amended is known as:',
        'According to A.V. Dicey, the Rule of Law includes all EXCEPT:',
        'The doctrine of Separation of Powers was prominently advocated by:',
        'In a federal system of government, power is:',
        'Section 1(3) of the 1999 Constitution of Nigeria (as amended) provides that:',
        'Which of the following is NOT a primary source of Nigerian Law?',
        'The highest court in the Nigerian judicial hierarchy is:',
        'For a custom to be valid and enforceable in Nigeria, it must pass the:',
        'The Received English Law in Nigeria consists of:',
        'In Nigeria, the legal profession is fused, meaning:'
    ];

    let deleted = 0;
    for (const q of dummyQuestions) {
        const { error } = await supabase.from('questions').delete().eq('question_text', q);
        if (error) console.error('Error deleting:', q, error.message);
        else deleted++;
    }
    console.log('Deleted ' + deleted + ' dummy questions');

    // Update all course counts
    const { data: courses } = await supabase.from('courses').select('code');
    for (const c of courses) {
        const { count: pq_count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('course_code', c.code);
        const { data: topics } = await supabase.from('questions').select('topic').eq('course_code', c.code);
        const uniqueTopics = new Set((topics || []).map(t => t.topic));
        await supabase.from('courses').update({ pq_count: pq_count || 0, topics_count: uniqueTopics.size || 0 }).eq('code', c.code);
        console.log('Updated ' + c.code + ': pq=' + pq_count + ' topics=' + uniqueTopics.size);
    }
    console.log('Done!');
}
fix();
