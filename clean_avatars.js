import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yuyzjkdfpewkrehfvyfq.supabase.co',
  'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb'
);

async function cleanUpAvatars() {
  // 1. Get all profiles
  const { data: profiles, error: profileError } = await supabase.from('profiles').select('avatar');
  if (profileError) {
    console.error('Error fetching profiles:', profileError);
    return;
  }

  // 2. Extract filenames of active avatars
  const activeAvatarNames = new Set();
  profiles.forEach(p => {
    if (p.avatar && p.avatar.includes('/storage/v1/object/public/avatars/')) {
      const parts = p.avatar.split('/avatars/');
      if (parts.length > 1) {
        activeAvatarNames.add(parts[1]);
      }
    }
  });

  // 3. List all files in 'avatars' bucket
  const { data: files, error: listError } = await supabase.storage.from('avatars').list();
  if (listError) {
    console.error('Error listing avatars:', listError);
    return;
  }

  // 4. Find files to delete
  const toDelete = [];
  files.forEach(f => {
    if (f.name !== '.emptyFolderPlaceholder' && !activeAvatarNames.has(f.name)) {
      toDelete.push(f.name);
    }
  });

  console.log(`Found ${files.length} total files in 'avatars' bucket.`);
  console.log(`Found ${activeAvatarNames.size} active avatars in profiles.`);
  console.log(`Deleting ${toDelete.length} unused files:`, toDelete);

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase.storage.from('avatars').remove(toDelete);
    if (deleteError) {
      console.error('Error deleting unused avatars:', deleteError);
    } else {
      console.log('Successfully deleted unused avatars.');
    }
  }
}

cleanUpAvatars();
