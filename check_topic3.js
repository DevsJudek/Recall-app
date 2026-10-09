import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function checkTopic3Questions() {
  const { data: topic3Qs, error } = await supabase
    .from('questions')
    .select('question_text')
    .match({ course_code: 'BUL 301', topic: '03 Agency vs. Similar relations' });
    
  if (error) {
      console.error(error);
      return;
  }
    
  console.log(`Topic 3 has ${topic3Qs.length} questions.`);
  console.log("Sample of first 5:", topic3Qs.slice(0, 5).map(q => q.question_text));
  console.log("Sample of last 5:", topic3Qs.slice(-5).map(q => q.question_text));
}

checkTopic3Questions();
