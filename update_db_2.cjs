const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) env[key.trim()] = val.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function updateDB() {
  // Update PHL 301 to PHL 319
  await supabase.from('courses').update({ code: 'PHL 319' }).eq('code', 'PHL 301');
  
  // Remove HIS 301 and HIS 302 from the courses table
  await supabase.from('courses').delete().in('code', ['HIS 301', 'HIS 302']);
  
  console.log('Database updated successfully for PHL and HIS!');
}

updateDB().catch(console.error);
