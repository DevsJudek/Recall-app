const url = 'https://yuyzjkdfpewkrehfvyfq.supabase.co/rest/v1/module_readings?select=*';
const anonKey = 'sb_publishable_hS8wU0xpCt2gkSmlAYe5lQ_mHQKoGZb';

fetch(url, {
    headers: {
        'apikey': anonKey,
        'Authorization': 'Bearer ' + anonKey
    }
})
.then(res => res.json())
.then(data => {
    if (!Array.isArray(data)) {
        console.log('Error:', data);
        return;
    }
    const maliciousNote = data.find(d => 
        (d.content && d.content.includes('Sokoto Jihad')) || 
        (d.content && d.content.includes('Islamic Law')) ||
        (d.content_text && d.content_text.includes('Sokoto Jihad')) ||
        (JSON.stringify(d).includes('Sokoto Jihad'))
    );
    if (maliciousNote) {
        console.log('Found it!', maliciousNote.id, maliciousNote.topic);
    } else {
        console.log('Not found in module_readings');
    }
})
.catch(console.error);
