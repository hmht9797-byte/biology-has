#!/usr/bin/env node
/**
 * Optional: export a chapter's music-only motion graphic as an MP4 (1920×1080, 30 fps) — same data, drawing and
 * music as inside the app. The app itself plays them live and needs no video files.
 *
 *   node scripts/export_mp4.mjs g2-c1 g6-c1      → out/g2-c1.mp4 …
 *   node scripts/export_mp4.mjs --grade 3         every chapter of grade 3
 *
 * Steps per chapter: (1) render the music with Web Audio in headless Chromium (OfflineAudioContext) → public/music/<key>.wav
 *                    (2) npx remotion render (composition "Motion", src/MotionClip.tsx) with the music as its audio track.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GEN = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = resolve(GEN, '..', 'app');
const LOCAL_BROWSER = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const require = createRequire(import.meta.url);
const book = JSON.parse(readFileSync(join(APP, 'chapters.json'), 'utf8'));

function chapters() {
  const args = process.argv.slice(2), gi = args.indexOf('--grade');
  const all = readdirSync(join(APP, 'motion')).flatMap((g) => readdirSync(join(APP, 'motion', g)).map((f) => `${g}-${f.replace('.json', '')}`));
  return gi >= 0 ? all.filter((k) => k.startsWith(`g${args[gi + 1]}-`)) : all.filter((k) => args.includes(k));
}
function meta(key) {
  const [, g, n] = key.match(/^g(\d+)-c(\d+)$/).map(Number);
  const gr = book.grades.find((x) => x.id === g), ch = gr.chapters.find((x) => x.n === n);
  return { key, grade: gr.name, gradeId: g, n, title: ch.t, color: ch.c || gr.c };
}

async function music(list) {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch { console.warn('playwright غير متاح: سيُصدَّر الفيديو بلا موسيقى'); return {}; }
  const b = await chromium.launch(existsSync(LOCAL_BROWSER) ? { executablePath: LOCAL_BROWSER } : {});
  const p = await b.newPage();
  await p.setContent('<!doctype html><title>music</title>');
  await p.addScriptTag({ path: join(APP, 'motion_engine.js') });
  mkdirSync(join(GEN, 'public', 'music'), { recursive: true });
  const out = {};
  for (const { key, data, m } of list) {
    const b64 = await p.evaluate(async ([m, data]) => {
      const buf = await MG.renderAudio(m, data, 44100);
      const n = buf.length, ch = [buf.getChannelData(0), buf.getChannelData(1)], dv = new DataView(new ArrayBuffer(44 + n * 4));
      const w = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
      w(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
      dv.setUint32(24, 44100, true); dv.setUint32(28, 44100 * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, n * 4, true);
      for (let i = 0, o = 44; i < n; i++) for (const c of ch) { dv.setInt16(o, Math.max(-1, Math.min(1, c[i])) * 32767, true); o += 2; }
      let s = ''; const u = new Uint8Array(dv.buffer); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
      return btoa(s);
    }, [m, data]);
    writeFileSync(join(GEN, 'public', 'music', `${key}.wav`), Buffer.from(b64, 'base64'));
    out[key] = `music/${key}.wav`;
  }
  await b.close();
  return out;
}

const keys = chapters();
if (!keys.length) { console.log('مثال: node scripts/export_mp4.mjs g2-c1   أو   --grade 3'); process.exit(0); }
const list = keys.map((key) => { const [g, c] = key.split('-'); return { key, m: meta(key), data: JSON.parse(readFileSync(join(APP, 'motion', g, `${c}.json`), 'utf8')) }; });
const audio = await music(list);
const env = { ...process.env };
if (!env.REMOTION_BROWSER && existsSync(LOCAL_BROWSER)) env.REMOTION_BROWSER = LOCAL_BROWSER;
mkdirSync(join(GEN, 'out', 'props'), { recursive: true });
for (const { key, m, data } of list) {
  const pf = join(GEN, 'out', 'props', `${key}.json`);
  writeFileSync(pf, JSON.stringify({ data, meta: m, audio: audio[key] }));
  const r = spawnSync('npx', ['remotion', 'render', 'src/index.ts', 'Motion', join('out', `${key}.mp4`), `--props=${pf}`, '--log=error'], { cwd: GEN, stdio: 'inherit', env });
  if (r.status !== 0) process.exit(r.status || 1);
  console.log(`✓ out/${key}.mp4`);
}
