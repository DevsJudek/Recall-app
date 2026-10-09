const url = 'https://yuyzjkdfpewkrehfvyfq.supabase.co/rest/v1/module_readings?id=eq.761dde6a-eb57-4dc9-ac8f-5c7bc8cce2f9';
const anonKey = 'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb';

fetch(url, {
    method: 'DELETE',
    headers: {
        'apikey': anonKey,
        'Authorization': 'Bearer ' + anonKey
    }
})
.then(async res => {
    if (res.ok) {
        console.log('Successfully deleted the note from Supabase!');
    } else {
        const text = await res.text();
        console.log('Failed to delete:', res.status, text);
    }
})
.catch(console.error);
