// Checks every chapter motion graphic in app/motion/g<grade>/c<chapter>.json against the engine's rules.
//   node app/check_motion.cjs            (exit code 1 on any problem)
// Rules: known scene types and drawings, 3–7 scenes ending with "summary", 35–75 s in total, and a file for
// every chapter of the booklet except the exam / review chapters.
const fs = require('fs'), path = require('path');
const MG = require('./motion_engine.js');
const DIR = path.join(__dirname, 'motion');
const book = JSON.parse(fs.readFileSync(path.join(__dirname, 'chapters.json'), 'utf8'));
const SKIP = (c) => /امتحان|المراجعة/.test(c.t + c.lab);
let bad = 0, ok = 0, secs = 0;
for (const g of book.grades) for (const c of g.chapters) {
  if (SKIP(c)) continue;
  const f = path.join(DIR, 'g' + g.id, 'c' + c.n + '.json'), key = `g${g.id}-c${c.n}`;
  if (!fs.existsSync(f)) { console.log(`✗ ${key} ${c.t}: الملف غير موجود`); bad++; continue; }
  let data; try { data = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.log(`✗ ${key}: JSON غير صالح ${e.message}`); bad++; continue; }
  const errs = MG.validate(data);
  if (errs.length) { console.log(`✗ ${key} ${c.t}:\n   ` + errs.join('\n   ')); bad++; } else { ok++; secs += MG.timeline(data).total; }
}
console.log(`motion: ${ok} سليمة، ${bad} فيها مشكلات؛ المجموع ${Math.round(secs / 60)} دقيقة`);
process.exit(bad ? 1 : 0);
