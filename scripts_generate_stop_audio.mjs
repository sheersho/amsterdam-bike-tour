import { STOPS } from './src/data/tourdata.js';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';

const outDir = path.resolve('public/audio/stops');
fs.mkdirSync(outDir, { recursive: true });

const voice = 'Daniel';
const sampleRate = 22050;
if (!ffmpegPath) {
  throw new Error('ffmpeg-static binary path was not resolved.');
}

for (const stop of STOPS) {
  const txt = stop.narrative
    .replace(/\s+/g, ' ')
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .trim();

  const wavPath = path.join(outDir, `stop-${stop.id}.wav`);
  const mp3Path = path.join(outDir, `stop-${stop.id}.mp3`);

  console.log(`Generating stop-${stop.id}.mp3 (${stop.name})…`);

  execSync(
    `say -v ${JSON.stringify(voice)} -o ${JSON.stringify(wavPath)} --file-format=WAVE --data-format=LEI16@${sampleRate} -- ${JSON.stringify(txt)}`,
    { stdio: 'inherit' },
  );
  execSync(
    `${JSON.stringify(ffmpegPath)} -y -i ${JSON.stringify(wavPath)} -ac 1 -ar ${sampleRate} -b:a 128k ${JSON.stringify(mp3Path)}`,
    { stdio: 'inherit' },
  );
  fs.unlinkSync(wavPath);

  console.log(`  ✓ stop-${stop.id}.mp3`);
}

console.log('\nAll audio files generated.');
