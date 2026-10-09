import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function fixDuplicates() {
  console.log("Fetching BUL 301 Topic 3 questions...");
  const { data: topic3Qs, error: fetchErr } = await supabase
    .from('questions')
    .select('*')
    .match({ course_code: 'BUL 301', topic: '03 Agency vs. Similar relations' });
    
  if (fetchErr) {
      console.error("Fetch error:", fetchErr);
      return;
  }
  
  // Deduplicate
  const textSet = new Set();
  const uniqueQs = [];
  topic3Qs.forEach(q => {
      if (!textSet.has(q.question_text)) {
          textSet.add(q.question_text);
          uniqueQs.push(q);
      }
  });
  
  console.log(`Fetched ${topic3Qs.length} questions. Found ${uniqueQs.length} unique questions.`);
  
  if (uniqueQs.length === 50) {
      console.log("Deleting all questions for this topic...");
      const { error: delErr } = await supabase
        .from('questions')
        .delete()
        .match({ course_code: 'BUL 301', topic: '03 Agency vs. Similar relations' });
        
      if (delErr) {
          console.error("Delete error:", delErr);
          return;
      }
      
      console.log("Re-inserting the 50 unique questions...");
      const { error: insErr } = await supabase
        .from('questions')
        .insert(uniqueQs);
        
      if (insErr) {
          console.error("Insert error:", insErr);
      } else {
          console.log("Successfully fixed duplicates for Topic 3!");
      }
  } else {
      console.log("Expected exactly 50 unique questions, but found", uniqueQs.length);
  }
}

fixDuplicates();
