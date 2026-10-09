import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function run() {
  const { data, error } = await supabase.from('courses').select('*').ilike('department', '%socio%');
  console.log(data);
}
run();
