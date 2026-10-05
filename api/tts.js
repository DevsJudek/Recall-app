import { EdgeTTS } from 'edge-tts-universal';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, voice = 'en-NG-AbeoNeural' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // EdgeTTS constructor takes text as first arg, voice as second
    const tts = new EdgeTTS(text, voice);
    const { audio } = await tts.synthesize();
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to synthesize speech', details: error.message });
  }
}
