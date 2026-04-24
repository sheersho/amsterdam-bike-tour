import { STOPS } from './src/data/tourdata.js';
import fs from 'node:fs';
import path from 'node:path';

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!API_KEY) {
  console.error('Missing GOOGLE_TTS_API_KEY. Run: GOOGLE_TTS_API_KEY=your_key node scripts_generate_stop_audio.mjs');
  process.exit(1);
}

const outDir = path.resolve('public/audio/stops');
fs.mkdirSync(outDir, { recursive: true });

// en-GB-Neural2-B: British male, warm and natural — great for tourism narration
const VOICE = { languageCode: 'en-GB', name: 'en-GB-Neural2-B' };
const AUDIO_CONFIG = { audioEncoding: 'MP3', speakingRate: 0.95, pitch: -1.0 };

function cleanText(raw) {
  return raw
    .replace(/\s+/g, ' ')
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2014/g, ' — ')
    .trim();
}

async function synthesize(text) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: VOICE,
        audioConfig: AUDIO_CONFIG,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google TTS error ${res.status}: ${err}`);
  }
  const { audioContent } = await res.json();
  return Buffer.from(audioContent, 'base64');
}

let total = 0;
for (const stop of STOPS) {
  const sections = stop.sections || [];
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const fileNum = i + 1;
    const mp3Path = path.join(outDir, `stop-${stop.id}-${fileNum}.mp3`);
    const txt = cleanText(section.text);

    console.log(`Generating stop-${stop.id}-${fileNum}.mp3 (${stop.name} — ${section.title})…`);
    const audio = await synthesize(txt);
    fs.writeFileSync(mp3Path, audio);
    console.log(`  ✓ ${path.basename(mp3Path)}`);
    total++;

    // Stay within Google's rate limits
    await new Promise(r => setTimeout(r, 200));
  }
}

console.log(`\nDone — ${total} audio files generated in ${outDir}`);
