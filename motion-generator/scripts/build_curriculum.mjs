// يجمع data/scripts/g1.json … g6.json في data/curriculum.json (المصدر الوحيد للسكربتات)
import { readFileSync, writeFileSync } from 'node:fs';
const ROOT = new URL('..', import.meta.url).pathname;
const grades = [1, 2, 3, 4, 5, 6].map((id) => JSON.parse(readFileSync(`${ROOT}data/scripts/g${id}.json`, 'utf8')));
const cur = { voice: 'ar-SA-HamedNeural', fallbackVoice: 'gTTS (ar)', grades };
writeFileSync(`${ROOT}data/curriculum.json`, JSON.stringify(cur, null, 1) + '\n');
const all = grades.flatMap((g) => g.chapters);
console.log(`curriculum.json: ${grades.length} صفوف، ${all.length} فصلًا، ${all.filter((c) => c.scenes.length).length} لها سكربت، ${all.filter((c) => c.skip).length} مستثناة`);
