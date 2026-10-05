export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'umar' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // 1. Prepare stream ticket with YarnGPT
    const prepRes = await fetch('https://api.yarngpt.ai/api/v1/tts/prepare', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.YARNGPT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, voice, output_format: 'mp3' })
    });
    
    if (!prepRes.ok) {
        const err = await prepRes.text();
        console.error('YarnGPT Prepare Error:', err);
        throw new Error('Prepare failed: ' + prepRes.status);
    }

    const { ticket, stream_url } = await prepRes.json();
    
    // 2. Fetch actual audio using stream_url
    const audioRes = await fetch(`https://api.yarngpt.ai${stream_url}`);
    if (!audioRes.ok) throw new Error('Stream fetch failed');
    
    const arrayBuffer = await audioRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech', details: error.message });
  }
}
