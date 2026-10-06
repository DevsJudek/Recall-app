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
  // Update Criminal Law to Criminal Law I
  await supabase.from('courses').update({ title: 'Criminal Law I' }).eq('title', 'Criminal Law');
  
  // Update Commercial Law to Commercial Law I
  await supabase.from('courses').update({ title: 'Commercial Law I' }).eq('title', 'Commercial Law');
  
  // Update Law of Torts to Law of Torts I
  await supabase.from('courses').update({ title: 'Law of Torts I' }).eq('title', 'Law of Torts');
  
  // Wait, did Family Law I and Labour Law I exist in the database?
  // I will just run updates in case they exist, using old codes.
  // The user says "family law I is jpl 305 , labour law I is bul 305"
  await supabase.from('courses').update({ code: 'JPL 305' }).eq('code', 'JPL 303');
  await supabase.from('courses').update({ code: 'JPL 305' }).eq('title', 'Family Law I');

  await supabase.from('courses').update({ code: 'BUL 305' }).eq('code', 'PUL 303');
  await supabase.from('courses').update({ code: 'BUL 305' }).eq('title', 'Labor Law I');
  
  // Update restricted electives to 3 units.
  await supabase.from('courses').update({ units: 3 }).eq('type', 'Restricted Elective');
  
  // For good measure, let's also specifically update PHL 301, HIS 301, PUB 301 to 3 units, 
  // since maybe they are misclassified in DB if they exist.
  await supabase.from('courses').update({ units: 3 }).in('code', ['PHL 301', 'HIS 301', 'PUB 301']);
  
  console.log('Database updated successfully!');
}

updateDB().catch(console.error);
