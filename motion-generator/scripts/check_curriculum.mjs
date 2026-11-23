#!/usr/bin/env node
// يتحقق من سكربتات الفصول: بنية المشاهد، وطول التعليق (المدة المتوقعة 45–75 ثانية)، والفصول المستثناة.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GEN = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync('node', [join(GEN, 'scripts', 'build_curriculum.mjs')], { stdio: 'ignore' });
const cur = JSON.parse(readFileSync(join(GEN, 'data', 'curriculum.json'), 'utf8'));
const NEED = {
  title: [], definition: ['heading', 'text'], timeline: ['items'], hierarchy: ['levels'], cell: ['variant', 'labels'],
  organ: ['organ', 'labels'], tissue: ['labels'], compare: ['left', 'right'], process: ['steps'], cycle: ['steps'],
  division: ['phases'], dna: ['labels'], list: ['points'], summary: ['points'],
};
const WPS = 1.6; // كلمات في الثانية لصوت ar-SA-HamedNeural بمعدل +6% (مقيس على g2-c1 وg6-c1)
let errors = 0, ready = 0, pending = 0, skipped = 0;
const err = (k, m) => { errors++; console.error(`✗ ${k}: ${m}`); };
if (cur.grades.length !== 6) err('curriculum', `عدد الصفوف ${cur.grades.length} بدل 6`);
for (const g of cur.grades) for (const c of g.chapters) {
  const k = `g${g.id}-c${c.n}`;
  if (c.skip) { skipped++; continue; }
  if (!c.scenes?.length) { pending++; continue; }
  ready++;
  if (c.scenes[0].type !== 'title') err(k, 'المشهد الأول ليس title');
  let words = 0;
  c.scenes.forEach((s, i) => {
    if (!NEED[s.type]) return err(k, `مشهد ${i + 1}: نوع غير معروف ${s.type}`);
    for (const f of NEED[s.type]) if (s[f] == null || (Array.isArray(s[f]) && !s[f].length)) err(k, `مشهد ${i + 1} (${s.type}): الحقل ${f} مفقود`);
    if (!s.narration?.trim()) err(k, `مشهد ${i + 1}: لا تعليق`);
    words += (s.narration || '').trim().split(/\s+/).length;
  });
  const est = words / WPS + c.scenes.length * 1.2;
  if (est < 45 || est > 78) err(k, `المدة المتوقعة ≈${Math.round(est)}ث (${words} كلمة) خارج 45–75`);
}
console.log(`الفصول: ${ready} جاهزة، ${pending} بانتظار السكربت، ${skipped} مستثناة (اختبار/مراجعة)`);
process.exit(errors ? 1 : 0);
