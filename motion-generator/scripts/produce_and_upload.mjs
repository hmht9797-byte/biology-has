#!/usr/bin/env node
/**
 * إنتاج فيديوهات الموشن غرافيك ورفعها وربطها بالتطبيق.
 *
 *   node scripts/produce_and_upload.mjs g2-c1 g6-c1        فصول محددة
 *   node scripts/produce_and_upload.mjs --grade 3            كل فصول صف
 *   node scripts/produce_and_upload.mjs --all                كل الفصول التي لها سكربت
 *   خيارات: --no-upload (رندر فقط)  --force (أعد الإنتاج ولو كان موجودًا)
 *
 * لكل فصل: (أ) صوت عربي فصيح  ← scripts/tts.py (edge-tts ar-SA-HamedNeural، والبديل gTTS)
 *          (ب) رندر MP4 بدقة 1920×1080 وصورة غلاف JPG  ← npx remotion render / still
 *          (ج) رفع إلى أول وجهة متاحة:
 *              1. Supabase Storage (حاوية عامة biology-motion) إن وُجد SUPABASE_URL وSUPABASE_SERVICE_ROLE_KEY
 *              2. GitHub Releases (الإصدار motion-videos) إن كان gh مسجّل الدخول
 *              3. المستودع نفسه: media/motion/ ثم commit وpush، والرابط عبر jsDelivr مثبّتًا بهاش الـcommit
 *          (د) حفظ الرابط في src/data/motionVideos.json ثم ربط الخريطة بالتطبيق (scripts/link_app.py)
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GEN = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = resolve(GEN, '..');
const MAP = join(REPO, 'src', 'data', 'motionVideos.json');
const BUCKET = 'biology-motion';
const RELEASE = 'motion-videos';
const LOCAL_BROWSER = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const upload = !flag('--no-upload');
const force = flag('--force');

const run = (cmd, a, opts = {}) => {
  const r = spawnSync(cmd, a, { cwd: GEN, stdio: 'inherit', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${a.join(' ')} → ${r.status}`);
};
const out = (cmd, a, opts = {}) => execFileSync(cmd, a, { cwd: REPO, encoding: 'utf8', ...opts }).trim();

function curriculum() {
  run('node', ['scripts/build_curriculum.mjs']);
  return JSON.parse(readFileSync(join(GEN, 'data', 'curriculum.json'), 'utf8'));
}

function targets(cur) {
  const all = cur.grades.flatMap((g) => g.chapters.map((c) => ({ key: `g${g.id}-c${c.n}`, grade: g, ch: c })));
  const gi = args.indexOf('--grade');
  const pick = flag('--all') ? all : gi >= 0 ? all.filter((t) => t.grade.id === +args[gi + 1]) : all.filter((t) => args.includes(t.key));
  const ready = pick.filter((t) => !t.ch.skip && t.ch.scenes.length);
  pick.filter((t) => !ready.includes(t)).forEach((t) => console.log(`- ${t.key}: ${t.ch.skip || 'لا يوجد سكربت بعد'} (تُخطّى)`));
  return ready;
}

const loadMap = () => (existsSync(MAP) ? JSON.parse(readFileSync(MAP, 'utf8')) : { version: 1, videos: {} });
const saveMap = (m) => {
  mkdirSync(dirname(MAP), { recursive: true });
  m.videos = Object.fromEntries(Object.entries(m.videos).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
  writeFileSync(MAP, JSON.stringify(m, null, 1) + '\n');
};

function render(t) {
  const audio = JSON.parse(readFileSync(join(GEN, 'public', 'audio', t.key, 'manifest.json'), 'utf8'));
  const props = { key: t.key, gradeName: t.grade.name, chapter: t.ch, audio };
  mkdirSync(join(GEN, 'out', 'props'), { recursive: true });
  const pf = join(GEN, 'out', 'props', `${t.key}.json`);
  writeFileSync(pf, JSON.stringify(props));
  const env = { ...process.env };
  if (!env.REMOTION_BROWSER && existsSync(LOCAL_BROWSER)) env.REMOTION_BROWSER = LOCAL_BROWSER;
  const mp4 = join(GEN, 'out', `${t.key}.mp4`);
  const jpg = join(GEN, 'out', `${t.key}.jpg`);
  run('npx', ['remotion', 'render', 'src/index.ts', 'Chapter', mp4, `--props=${pf}`, '--log=error'], { env });
  run('npx', ['remotion', 'still', 'src/index.ts', 'Chapter', jpg, `--props=${pf}`, '--frame=45', '--image-format=jpeg', '--scale=0.5', '--log=error'], { env });
  const seconds = +out('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]);
  return { mp4, jpg, seconds: Math.round(seconds) };
}

/* ---------- وجهات الرفع ---------- */

async function supabaseUpload(files) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const h = { Authorization: `Bearer ${key}`, apikey: key };
  // الحاوية العامة (تُنشأ مرة واحدة؛ تجاهل «موجودة مسبقًا»)
  await fetch(`${url}/storage/v1/bucket`, { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }) });
  const urls = {};
  for (const [name, path, type] of files) {
    const r = await fetch(`${url}/storage/v1/object/${BUCKET}/${name}`, { method: 'POST', headers: { ...h, 'Content-Type': type, 'x-upsert': 'true' }, body: readFileSync(path) });
    if (!r.ok) throw new Error(`Supabase upload ${name}: ${r.status} ${await r.text()}`);
    urls[name] = `${url}/storage/v1/object/public/${BUCKET}/${name}`;
  }
  return { host: 'supabase', urls };
}

function ghReleaseUpload(files) {
  if (spawnSync('gh', ['auth', 'status'], { stdio: 'ignore' }).status !== 0) return null;
  const repo = out('gh', ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner']);
  if (spawnSync('gh', ['release', 'view', RELEASE], { cwd: REPO, stdio: 'ignore' }).status !== 0)
    run('gh', ['release', 'create', RELEASE, '--title', 'فيديوهات الموشن غرافيك', '--notes', 'ملخصات فصول الأحياء بالموشن غرافيك'], { cwd: REPO });
  run('gh', ['release', 'upload', RELEASE, '--clobber', ...files.map((f) => f[1])], { cwd: REPO });
  return { host: 'github-release', urls: Object.fromEntries(files.map(([n]) => [n, `https://github.com/${repo}/releases/download/${RELEASE}/${n}`])) };
}

/** الملاذ الأخير: ملفات داخل المستودع (خارج حزمة APK/AAB) تُقدَّم عبر jsDelivr مثبتة بهاش الـcommit */
function repoCdnUpload(files, key) {
  const dir = join(REPO, 'media', 'motion');
  mkdirSync(dir, { recursive: true });
  for (const [name, path] of files) copyFileSync(path, join(dir, name));
  const rel = files.map(([n]) => `media/motion/${n}`);
  run('git', ['add', ...rel], { cwd: REPO });
  if (spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: REPO }).status !== 0)
    run('git', ['-c', 'user.name=Claude', '-c', 'user.email=noreply@anthropic.com', 'commit', '-q', '-m', `فيديو الموشن غرافيك: ${key}`, ...rel], { cwd: REPO });
  const sha = out('git', ['rev-parse', 'HEAD']);
  const branch = out('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  run('git', ['-c', 'push.negotiate=true', 'push', '-q', 'origin', branch], { cwd: REPO });
  const slug = out('git', ['remote', 'get-url', 'origin']).replace(/^.*github\.com[/:]/, '').replace(/\.git$/, '');
  return { host: 'jsdelivr', urls: Object.fromEntries(files.map(([n]) => [n, `https://cdn.jsdelivr.net/gh/${slug}@${sha}/media/motion/${n}`])) };
}

async function publish(t, r) {
  const files = [
    [`${t.key}.mp4`, r.mp4, 'video/mp4'],
    [`${t.key}.jpg`, r.jpg, 'image/jpeg'],
  ];
  const mb = statSync(r.mp4).size / 1e6;
  if (mb > 19) console.warn(`  تنبيه: ${t.key}.mp4 حجمه ${mb.toFixed(1)}MB (jsDelivr لا يخدم ملفات GitHub فوق 20MB)`);
  return (await supabaseUpload(files)) ?? ghReleaseUpload(files) ?? repoCdnUpload(files, t.key);
}

async function main() {
  const cur = curriculum();
  const list = targets(cur);
  if (!list.length) return console.log('لا شيء لإنتاجه. مثال: node scripts/produce_and_upload.mjs g2-c1');
  const map = loadMap();
  for (const t of list) {
    if (!force && map.videos[t.key] && upload) {
      console.log(`= ${t.key}: موجود (${map.videos[t.key].url}); استعمل --force لإعادة الإنتاج`);
      continue;
    }
    console.log(`\n▶ ${t.key} — ${t.grade.name}: ${t.ch.title}`);
    run('python3', ['scripts/tts.py', t.key]);
    const r = render(t);
    if (r.seconds < 45 || r.seconds > 75) console.warn(`  تنبيه: المدة ${r.seconds}ث خارج النطاق 45–75ث، اختصر السكربت أو أطله`);
    console.log(`  رُندر: ${r.mp4} (${r.seconds}ث، ${(statSync(r.mp4).size / 1e6).toFixed(1)}MB)`);
    if (!upload) continue;
    const up = await publish(t, r);
    map.videos[t.key] = { title: t.ch.title, grade: t.grade.id, chapter: t.ch.n, seconds: r.seconds, url: up.urls[`${t.key}.mp4`], poster: up.urls[`${t.key}.jpg`], host: up.host };
    saveMap(map);
    console.log(`  رُفع (${up.host}): ${map.videos[t.key].url}`);
  }
  if (upload) run('python3', [join(GEN, 'scripts', 'link_app.py')]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
