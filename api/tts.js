import { EdgeTTS } from 'edge-tts-universal';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'en-US-ChristopherNeural' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const hash = crypto.MD5(text + voice).toString();
    const fileName = `${hash}.mp3`;

    const { data: publicUrlData } = supabase.storage.from('tts_cache').getPublicUrl(fileName);
    
    const headRes = await fetch(publicUrlData.publicUrl, { method: 'HEAD' });
    if (headRes.ok) {
        const audioRes = await fetch(publicUrlData.publicUrl);
        const arrayBuffer = await audioRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', buffer.length);
        return res.status(200).send(buffer);
    }

    const tts = new EdgeTTS(text, voice);
    const { audio } = await tts.synthesize();
    const arrayBuffer = await audio.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
        .from('tts_cache')
        .upload(fileName, audioBuffer, {
            contentType: 'audio/mpeg',
            cacheControl: '360000',
            upsert: false
        });

    if (uploadError) {
        console.error('Supabase upload error:', uploadError);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.status(200).send(audioBuffer);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech', details: error.message });
  }
}
