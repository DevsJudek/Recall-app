import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function inspectData() {
  // Update PUL 303 questions to have the apostrophe
  const { error: updateError } = await supabase
    .from('questions')
    .update({ topic: "03 Employee's Duties" })
    .match({ course_code: 'PUL 303', topic: '03 Employee Duties' });
    
  if (updateError) {
      console.error("Error updating PUL 303:", updateError);
  } else {
      console.log("Fixed PUL 303 Topic 3.");
  }

  // Inspect BUL 301 Topic 3
  const { data: topic3 } = await supabase
    .from('questions')
    .select('question_text')
    .match({ course_code: 'BUL 301', topic: '03 Agency vs. Similar relations' });
    
  console.log(`BUL 301 Topic 3 has ${topic3.length} questions.`);
  
  // Inspect BUL 301 Topic 2
  const { data: topic2 } = await supabase
    .from('questions')
    .select('question_text')
    .match({ course_code: 'BUL 301', topic: '02 Formation & Capacity' });
    
  console.log(`BUL 301 Topic 2 has ${topic2.length} questions.`);
  
  if (topic2.length > 0) {
      console.log("Sample Topic 2 question:", topic2[0].question_text);
  }
}

inspectData();
