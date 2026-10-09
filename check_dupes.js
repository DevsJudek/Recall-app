import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function checkDuplicates() {
  const { data: topic3Qs, error } = await supabase
    .from('questions')
    .select('question_text')
    .match({ course_code: 'BUL 301', topic: '03 Agency vs. Similar relations' });
    
  if (error) {
      console.error(error);
      return;
  }
  
  const textSet = new Set();
  let dupCount = 0;
  topic3Qs.forEach(q => {
      if (textSet.has(q.question_text)) {
          dupCount++;
      } else {
          textSet.add(q.question_text);
      }
  });
  
  console.log(`Topic 3 has ${topic3Qs.length} total questions.`);
  console.log(`There are ${dupCount} duplicate questions (exact text matches).`);
}

checkDuplicates();
