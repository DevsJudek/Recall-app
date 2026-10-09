import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function inspectData2() {
  const { data: topic2Qs } = await supabase
    .from('questions')
    .select('course_code, topic')
    .ilike('topic', '%02%')
    .in('course_code', ['BUL 301', 'BUL 305']);
  
  console.log("Topic 2 Questions courses:", new Set(topic2Qs.map(q => q.course_code)));
  
  const { data: topic3Qs } = await supabase
    .from('questions')
    .select('course_code, topic')
    .ilike('topic', '%03%')
    .in('course_code', ['BUL 301', 'BUL 305']);
    
  console.log("Topic 3 Questions courses:", new Set(topic3Qs.map(q => q.course_code)));
  
  const { data: topic2Mods } = await supabase
    .from('module_readings')
    .select('course_code, topic')
    .ilike('topic', '%02%')
    .in('course_code', ['BUL 301', 'BUL 305']);
    
  console.log("Topic 2 Modules courses:", new Set(topic2Mods.map(m => m.course_code)));
}

inspectData2();
