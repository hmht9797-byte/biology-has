// يطبع إطارًا من منتصف كل مشهد (نحو ٧٥٪ منه) لفحص الرسوم: node scripts/sample_frames.mjs out/props/g6-c1.json
import { readFileSync } from 'node:fs';
const p = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const FPS = 30, LEAD = 0.5, TAIL = 0.7;
let from = 0;
const out = p.chapter.scenes.map((s, i) => {
  const d = Math.ceil((LEAD + (p.audio[i]?.duration ?? 4) + TAIL) * FPS);
  const f = from + Math.round(d * 0.78);
  from += d;
  return f;
});
console.log(out.join(' '), `TOTAL=${from}`);
