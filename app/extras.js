// ===== Extra sections: 3D lab, test centre, smart flashcards, contact =====
const CONTACT = { name: 'الأستاذ حسن مجتبى الطويل', facebook: 'https://www.facebook.com/share/1EQqwpqXBn/?mibextid=wwXIfr', instagram: 'https://www.instagram.com/biohmt?bqrl=enJvYzdnNGdha3A4&utm_source=qr', phone: '07877887754', email: 'hmht9797@gmail.com' };
const GN = { 1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع', 6: 'السادس' };

// ---------- icon library: one source for every UI icon (24px grid, 2px stroke, round caps) ----------
const ICON = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  dna: '<path d="M8 3c0 6 8 6 8 9s-8 3-8 9"/><path d="M16 3c0 6-8 6-8 9s8 3 8 9"/><path d="M9 7h6M9 17h6"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  cube: '<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  test: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/><path d="m14 16 1.5 1.5L18 15"/>',
  cards: '<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/><path d="M7 13h5M9.5 10.5v5"/>',
  draw: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  rotate: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  flip: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  star: '<path d="m12 3 2.7 5.5 6 .9-4.35 4.25 1 6L12 16.8l-5.35 2.85 1-6L3.3 9.4l6-.9z"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.4 3.4M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18"/>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  landmark: '<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2 10l10-7 10 7z"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
};
const ico = (n, s = 22, cls = '') => `<svg class="i${cls ? ' ' + cls : ''}" width="${s}" height="${s}" style="width:${s}px;height:${s}px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON[n] || ''}</svg>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v } catch (e) { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } } };

// ---------- Arabic counted nouns: «٨ رسوم» / «٤٥ رسمًا» / «١٠٠ رسم» ----------
// forms: [1, 2 (dual), 3–10, 11–99, hundreds]
const NOUN = {
  q: ['سؤال', 'سؤالان', 'أسئلة', 'سؤالًا', 'سؤال'],
  qi: ['سؤال تفاعلي', 'سؤالان تفاعليان', 'أسئلة تفاعلية', 'سؤالًا تفاعليًا', 'سؤال تفاعلي'],
  fig: ['رسم', 'رسمان', 'رسوم', 'رسمًا', 'رسم'],
  figi: ['رسم توضيحي', 'رسمان توضيحيان', 'رسوم توضيحية', 'رسمًا توضيحيًا', 'رسم توضيحي'],
  model: ['مجسّم ثلاثي الأبعاد', 'مجسّمان ثلاثيا الأبعاد', 'مجسّمات ثلاثية الأبعاد', 'مجسّمًا ثلاثي الأبعاد', 'مجسّم ثلاثي الأبعاد'],
  card: ['بطاقة', 'بطاقتان', 'بطاقات', 'بطاقة', 'بطاقة'],
  name: ['اسم', 'اسمان', 'أسماء', 'اسمًا', 'اسم'],
  time: ['مرة', 'مرتان', 'مرات', 'مرة', 'مرة'],
};
const nAR = (n, k) => { const f = NOUN[k], r = n % 100; if (n === 2) return f[1]; if (n === 1) return AR(1) + ' ' + f[0]; const w = (r >= 3 && r <= 10) || n === 0 ? f[2] : r >= 11 ? f[3] : f[4]; return AR(n) + ' ' + w; };

// ---------- toast: short feedback after an action ----------
function toast(msg, tone) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
  t.className = 'toast ' + (tone || 'ok');
  t.innerHTML = ico(tone === 'bad' ? 'alert' : 'checkCircle', 18) + '<span>' + msg + '</span>';
  void t.offsetWidth; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400);
}
const backLink = (id, label) => `<div class="foot"><button class="rv back" id="${id}">${ico('arrowRight', 18)}<span>${label}</span></button></div>`;

function tabbar(active) {
  const t = $('#tabs'); t.hidden = false;
  t.querySelectorAll('button').forEach(b => { const on = b.dataset.t === active; b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
}
function hideTabs() { $('#tabs').hidden = true; }
function shell(title, inner) { LAB.stop(); $('#nav').hidden = true; $('#quizBtn').hidden = true; $('#barTitle').textContent = title; $('#prog').style.width = '0'; $('#view').innerHTML = inner; toTop0(); }
function gradeTabs(cur, base) {
  return `<div class="gtabs" role="tablist" aria-label="الصف">${BOOK.grades.map(x => x.id).map(g => `<button role="tab" aria-selected="${g == cur}" class="${g == cur ? 'on' : ''}" data-href="${base}-g${g}"><span class="gl"><span class="gpre">الصف </span>${GN[g]}</span></button>`).join('')}</div>`;
}
function wireGradeTabs() { document.querySelectorAll('.gtabs button').forEach(b => b.onclick = () => go(b.dataset.href)); }

// ---------- 3D lab ----------
function labHome(g) {
  g = g || 1; tabbar('lab');
  const items = LAB.LIST.filter(x => x.g == g);
  shell('المختبر ثلاثي الأبعاد', `<div class="wrap xpage">
   <div class="xhead"><span class="xbadge">${ico('cube', 28)}</span><div><h2>المختبر ثلاثي الأبعاد</h2><p>مجسّمات حقيقية: اسحب بإصبعك لتدويرها في كل الاتجاهات، وقرّب بإصبعين، وفعّل الأسماء لتعرف كل جزء.</p></div></div>
   ${gradeTabs(g, 'lab')}
   ${labSeg(g, 'lab')}
   ${items.length ? `<div class="labgrid">${items.map(x => `<button class="labcard" style="--cc:${x.c}" data-id="${x.id}"><span class="lc-ic">${ico('cube', 28)}</span><b>${x.t}</b><small>${x.d}</small><span class="lc-go">افتح المجسّم ${ico('arrowLeft', 16)}</span></button>`).join('')}</div>` : emptyState('cube', 'لا توجد مجسّمات لهذا الصف بعد', 'جرّب صفًا آخر من الأعلى.')}
  </div>`);
  wireGradeTabs(); wireSeg(); document.querySelectorAll('.labcard').forEach(b => b.onclick = () => go('lab-' + b.dataset.id));
}
function emptyState(icon, title, sub) { return `<div class="empty">${ico(icon, 34)}<b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</div>`; }
function labView(id) {
  const x = LAB.LIST.find(m => m.id == id); if (!x) return labHome();
  hideTabs();
  shell(x.t, `<div class="viewer" style="--cc:${x.c}">
    <div class="stage" id="stage"><p class="lab-load"><span class="spin" aria-hidden="true"></span>جارٍ تحميل المجسّم…</p></div>
    <div class="vbar wrap">
      <button id="vBack">${ico('arrowRight', 18)}رجوع</button><button id="vLab" aria-pressed="true" disabled>${ico('tag', 18)}الأسماء</button><button id="vRot" aria-pressed="true" disabled>${ico('rotate', 18)}تدوير تلقائي</button><button id="vReset" disabled>${ico('reset', 18)}إعادة</button>
    </div>
    <div class="vinfo wrap"><span class="xbadge sm">الصف ${GN[x.g]}</span><p>${x.d}</p><small>اسحب للتدوير ٣٦٠°، وقرّب بإصبعين أو بعجلة الفأرة.</small></div>
  </div>`);
  $('#vBack').onclick = () => go('lab-g' + x.g);
  LAB.open($('#stage'), id, { ready: c => {
    ['#vLab', '#vRot', '#vReset'].forEach(k => $(k).disabled = false); // controls only work once the model is ready
    $('#vLab').onclick = e => e.currentTarget.setAttribute('aria-pressed', c.toggleLabels());
    $('#vRot').onclick = e => e.currentTarget.setAttribute('aria-pressed', c.toggleAuto());
    $('#vReset').onclick = c.reset;
  }, onInteract: () => $('#vRot') && $('#vRot').setAttribute('aria-pressed', 'false') });
}

// ---------- required 2D diagrams + label self-test ----------
function labSeg(g, cur) {
  return `<div class="lseg"><button class="${cur === 'lab' ? 'on' : ''}" aria-pressed="${cur === 'lab'}" data-href="lab-g${g}">${ico('cube', 18)} مجسّمات ٣٦٠°</button><button class="${cur === 'figs' ? 'on' : ''}" aria-pressed="${cur === 'figs'}" data-href="figs-g${g}">${ico('draw', 18)} الرسوم المطلوبة</button></div>`;
}
function wireSeg() { document.querySelectorAll('.lseg button').forEach(b => b.onclick = () => go(b.dataset.href)); }
const FIGS = () => BOOK.figs || [];
const hzBadge = () => `<span class="hz">${ico('bookmark', 14)}للحفظ</span>`;
function figsHome(g) {
  g = g || 1; tabbar('lab');
  const all = FIGS().map((f, i) => ({ ...f, i })).filter(f => f.g == g);
  const seen = store.get('bioFigs', {});
  const chs = [...new Set(all.map(f => f.ch))];
  const anyHz = all.some(f => f.h);
  shell('الرسوم المطلوبة', `<div class="wrap xpage">
   <div class="xhead"><span class="xbadge">${ico('draw', 26)}</span><div><h2>الرسوم المطلوبة</h2><p>كل رسوم الكتاب في مكان واحد. افتح أي رسم ثم اضغط «اختبر نفسك» لتُخفى الأسماء، وحاول تذكّرها قبل أن تكشفها.</p></div></div>
   ${gradeTabs(g, 'figs')}
   ${labSeg(g, 'figs')}
   <p class="fnote">${anyHz ? `${hzBadge()} رسوم مهمة يتكرر طلبها في الامتحان. ` : ''}لهذا الصف ${nAR(all.length, 'fig')}.</p>
   ${all.length ? chs.map(n => { const fs = all.filter(f => f.ch == n); return `<h3 class="sec-h">${fs[0].ct}</h3><div class="figgrid">${fs.map(f => `<button class="figcard" style="--cc:${f.c}" data-i="${f.i}"><span class="fthumb">${f.svg}</span><b>${f.t}</b>${f.h || seen[f.i] ? `<span class="fmeta">${f.h ? hzBadge() : ''}${seen[f.i] ? `<span class="fdone">${ico('check', 14)}شاهدته</span>` : ''}</span>` : ''}</button>`).join('')}</div>`; }).join('') : emptyState('draw', 'لا توجد رسوم لهذا الصف بعد', '')}
  </div>`);
  wireGradeTabs(); wireSeg();
  document.querySelectorAll('.figcard').forEach(b => b.onclick = () => go('fig-' + b.dataset.i));
}
function figView(i) {
  i = +i; const F = FIGS(), f = F[i]; if (!f) return figsHome();
  hideTabs();
  const same = F.map((x, k) => ({ ...x, k })).filter(x => x.g == f.g), pos = same.findIndex(x => x.k == i);
  const QUIZ_ON = ico('eyeOff', 18) + 'اختبر نفسك', QUIZ_OFF = ico('x', 18) + 'إنهاء الاختبار';
  shell('الرسوم', `<div class="wrap xpage fview" style="--cc:${f.c}">
    <div class="fvhead"><span class="xbadge sm">الصف ${GN[f.g]}</span><span class="xbadge sm alt">${f.ct}</span>${f.h ? hzBadge() : ''}</div>
    <h2 class="fvt">${f.t}</h2>
    <div class="fig gfig" id="gfig">${f.svg}</div>
    <div class="fscore" id="fscore" role="status" hidden></div>
    <div class="vbar"><button id="fBack">${ico('arrowRight', 18)}الرسوم</button><button id="fQuiz" aria-pressed="false">${QUIZ_ON}</button><button id="fAll" hidden>${ico('eye', 18)}اكشف الكل</button></div>
    <div class="vbar pager"><button id="fPrev" ${pos > 0 ? '' : 'disabled'}>${ico('arrowRight', 18)}السابق</button><span class="pos">${AR(pos + 1)} من ${AR(same.length)}</span><button id="fNext" ${pos < same.length - 1 ? '' : 'disabled'}>التالي${ico('arrowLeft', 18)}</button></div>
    <p class="fnote">في وضع «اختبر نفسك» تُغطّى الأسماء؛ قل اسم الجزء بصوت عالٍ ثم اضغط على الغطاء لتتحقق.</p>
  </div>`);
  const seen = store.get('bioFigs', {}); seen[i] = 1; store.set('bioFigs', seen);
  $('#fBack').onclick = () => go('figs-g' + f.g);
  $('#fPrev').onclick = () => pos > 0 && go('fig-' + same[pos - 1].k);
  $('#fNext').onclick = () => pos < same.length - 1 && go('fig-' + same[pos + 1].k);
  const svg = $('#gfig svg'); let covers = [];
  const score = () => { const left = covers.filter(c => c.isConnected).length, n = covers.length; $('#fscore').hidden = false; $('#fscore').innerHTML = left ? `كشفت ${AR(n - left)} من ${nAR(n, 'name')}` : `${ico('checkCircle', 18)} أحسنت! كشفت كل الأسماء (${AR(n)})`; };
  const quizOff = () => { covers.forEach(c => c.remove()); covers = []; $('#fscore').hidden = true; $('#fAll').hidden = true; $('#fQuiz').setAttribute('aria-pressed', 'false'); $('#fQuiz').innerHTML = QUIZ_ON; };
  $('#fQuiz').onclick = () => {
    if (covers.length) return quizOff();
    const NS = 'http://www.w3.org/2000/svg';
    svg.querySelectorAll('text').forEach(t => {
      if (!/[؀-ۿA-Za-z]/.test(t.textContent)) return;
      let b; try { b = t.getBBox(); } catch (e) { return; } if (!b.width) return;
      const r = document.createElementNS(NS, 'rect');
      // keep every cover inside the viewBox: a cover crossing the edge gets clipped flat
      const vb = svg.viewBox && svg.viewBox.baseVal; let x0 = b.x - 4, x1 = b.x + b.width + 4, y0 = b.y - 3, y1 = b.y + b.height + 3;
      if (vb && vb.width) { x0 = Math.max(vb.x + 1, x0); x1 = Math.min(vb.x + vb.width - 1, x1); y0 = Math.max(vb.y + 1, y0); y1 = Math.min(vb.y + vb.height - 1, y1); }
      r.setAttribute('x', x0); r.setAttribute('y', y0); r.setAttribute('width', x1 - x0); r.setAttribute('height', y1 - y0); r.setAttribute('rx', 7);
      r.setAttribute('class', 'fcov'); r.setAttribute('tabindex', '0'); r.setAttribute('role', 'button'); r.setAttribute('aria-label', 'اكشف الاسم');
      const rev = () => { r.remove(); score(); }; r.addEventListener('click', rev); r.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && rev());
      svg.appendChild(r); covers.push(r);
    });
    $('#fQuiz').setAttribute('aria-pressed', 'true'); $('#fQuiz').innerHTML = QUIZ_OFF; $('#fAll').hidden = false; score();
  };
  $('#fAll').onclick = () => { covers.forEach(c => c.remove()); score(); };
}

// ---------- test centre ----------
const best = () => store.get('bioBest', {});
function testsHome(g) {
  g = g || 1; tabbar('tests');
  const gr = BOOK.grades.find(x => x.id == g), all = gr.chapters.reduce((a, c) => a + c.mcq.length, 0), B = best();
  const mode = (k, icon, t, d) => `<button class="tmode" data-k="${k}"><span class="tm-ic">${ico(icon, 22)}</span><b>${t}</b><small>${d}</small>${B['g' + g + k] != null ? `<span class="tbest">${ico('trophy', 14)}أفضل نتيجة: ${AR(B['g' + g + k])}٪</span>` : ''}</button>`;
  shell('مركز الاختبارات', `<div class="wrap xpage">
   <div class="xhead"><span class="xbadge">${ico('test', 26)}</span><div><h2>مركز الاختبارات</h2><p>اختبر نفسك بأسئلة الملزمة، وتابع أفضل نتائجك في كل نمط.</p></div></div>
   ${gradeTabs(g, 'tests')}
   <div class="tmodes">
    ${mode('quick', 'zap', 'اختبار سريع', AR(10) + ' أسئلة عشوائية من كل الفصول')}
    ${mode('exam', 'test', 'امتحان تجريبي', AR(30) + ' سؤالًا متنوعًا (اختيار من متعدد وصح وخطأ)')}
    ${mode('full', 'layers', 'الاختبار الشامل', 'كل أسئلة الصف (' + nAR(all, 'q') + ')')}
    ${mode('timed', 'timer', 'تحدّي الدقيقتين', 'أجب عن أكبر عدد من الأسئلة قبل انتهاء الوقت')}
   </div>
   <h3 class="sec-h">اختبار حسب الفصل</h3>
   <div class="grid">${gr.chapters.filter(c => c.mcq.length).map(c => `<button class="chap" style="--cc:${c.c}" data-ch="${c.n}"><span class="num">${c.lab === 'المراجعة الشاملة' ? ico('star', 22) : AR(c.n)}</span><span class="tt"><b>${c.t}</b><small>${nAR(c.mcq.length, 'q')}</small></span>${B['g' + g + 'ch' + c.n] != null ? `<span class="st done">${ico('trophy', 13)}${AR(B['g' + g + 'ch' + c.n])}٪</span>` : ''}</button>`).join('')}</div>
  </div>`);
  wireGradeTabs();
  document.querySelectorAll('.tmode').forEach(b => b.onclick = () => go(`test-g${g}-${b.dataset.k}`));
  document.querySelectorAll('.chap').forEach(b => b.onclick = () => go(`test-g${g}-ch${b.dataset.ch}`));
}
let TQ = null;
function testRun(g, k) {
  if (!setGrade(g)) return testsHome();
  hideTabs();
  let pool = []; CH.forEach(c => (!k.startsWith('ch') || 'ch' + c.n === k) && c.mcq.forEach(m => pool.push({ ...m, c })));
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
  if (k === 'quick') pool = pool.slice(0, 10); else if (k === 'exam') pool = pool.slice(0, 30);
  TQ = { g, k, qs: pool, i: 0, score: 0, timed: k === 'timed', end: k === 'timed' ? Date.now() + 120000 : 0, wrong: [] };
  shell('اختبار الصف ' + GN[g], '<div class="wrap quiz" id="tq"></div>');
  tShow();
}
let tTimer = 0;
const verdict = pct => pct >= 90 ? 'ممتاز! أنت جاهز للامتحان' : pct >= 70 ? 'جيد جدًا، راجع الأسئلة التي أخطأت فيها' : pct >= 50 ? 'جيد، تحتاج إلى مراجعة بعض الفصول' : 'لا بأس، راجع الملخصات ثم أعد المحاولة';
function tShow() {
  clearInterval(tTimer);
  const Q = TQ, box = $('#tq'); if (!box) return;
  const done = Q.i >= Q.qs.length || (Q.timed && Date.now() >= Q.end);
  if (done) {
    const n = Q.timed ? Q.i : Q.qs.length, pct = n ? Math.round(Q.score / n * 100) : 0, key = 'g' + Q.g + Q.k, B = best();
    const rec = B[key] == null || pct > B[key];
    if (rec) { B[key] = pct; store.set('bioBest', B); }
    box.innerHTML = `<div class="qcard score"><div>${Q.timed ? 'أجبت عن ' + nAR(n, 'q') + ' في دقيقتين' : 'نتيجتك'}</div><b>${AR(Q.score)} / ${AR(n)}</b><p>${verdict(pct)}</p>${rec && n ? `<span class="tbest">${ico('trophy', 14)}أفضل نتيجة لك في هذا النمط: ${AR(pct)}٪</span>` : ''}
     ${Q.wrong.length ? `<details class="wrongs"><summary>راجع أخطاءك (${AR(Q.wrong.length)})</summary>${Q.wrong.map(w => `<div class="wq"><div>${w.q}</div><span>الصحيح: ${w.o[w.a]}${w.x ? ' — ' + w.x : ''}</span></div>`).join('')}</details>` : ''}
     <button class="qnext" id="again">${ico('reset', 18)}أعد الاختبار</button><button class="qnext alt" id="back">${ico('list', 18)}مركز الاختبارات</button></div>`;
    $('#again').onclick = () => testRun(Q.g, Q.k); $('#back').onclick = () => go('tests-g' + Q.g); return;
  }
  const q = Q.qs[Q.i];
  $('#prog').style.width = Q.timed ? (100 - (Q.end - Date.now()) / 1200) + '%' : (Q.i / Q.qs.length * 100) + '%';
  box.innerHTML = `<div class="qcard"><div class="qmeta"><span>${Q.timed ? `<b class="tleft">${ico('timer', 16)}<span id="tleft"></span></b>` : 'السؤال ' + AR(Q.i + 1) + ' من ' + AR(Q.qs.length)}</span><span>الدرجة: ${AR(Q.score)}</span></div>
   <span class="qtag" style="--cc:${q.c.c}">${q.c.lab === 'المراجعة الشاملة' ? '' : unitName(q.c) + ': '}${q.c.t}</span>
   <div class="qq">${q.q}</div><div class="qo">${q.o.map((o, k) => `<button data-k="${k}">${o}</button>`).join('')}</div>
   <div class="qx" id="qx" hidden></div><button class="qnext" id="qn" hidden>${Q.i + 1 < Q.qs.length ? 'السؤال التالي' + ico('arrowLeft', 18) : ico('trophy', 18) + 'اعرض النتيجة'}</button></div>`;
  if (Q.timed) { const tick = () => { const s = Math.max(0, Math.ceil((Q.end - Date.now()) / 1000)); const e = $('#tleft'); if (e) e.textContent = AR(Math.floor(s / 60)) + ':' + AR(String(s % 60).padStart(2, '0')); $('#prog').style.width = (100 - (Q.end - Date.now()) / 1200) + '%'; if (s <= 0) tShow(); }; tick(); tTimer = setInterval(tick, 500); }
  document.querySelectorAll('.qo button').forEach(b => b.onclick = () => {
    if ($('.qo').dataset.d) return; $('.qo').dataset.d = 1;
    const k = +b.dataset.k; document.querySelectorAll('.qo button')[q.a].classList.add('right');
    if (k === q.a) Q.score++; else { b.classList.add('wrong'); Q.wrong.push(q); }
    if (q.x && !Q.timed) { $('#qx').innerHTML = '<b>التصحيح:</b> ' + q.x; $('#qx').hidden = false; }
    if (Q.timed) { setTimeout(() => { Q.i++; tShow(); }, 550); return; }
    $('#qn').hidden = false; $('#qn').focus();
  });
  $('#qn').onclick = () => { Q.i++; tShow(); toTop0(); };
}

// ---------- smart flashcards (Leitner spaced repetition) ----------
function cardsOf(g) { const gr = BOOK.grades.find(x => x.id == g); const out = []; gr.chapters.forEach(c => (c.cards || []).forEach((k, i) => out.push({ id: g + '-' + c.n + '-' + i, ...k, c }))); return out; }
function cardsHome(g) {
  g = g || 1; tabbar('cards');
  const all = cardsOf(g), S = store.get('bioLeitner', {}), cnt = [0, 0, 0, 0];
  all.forEach(k => cnt[Math.min(3, S[k.id] || 0)]++);
  const pct = all.length ? Math.round(cnt[3] / all.length * 100) : 0;
  shell('بطاقات الحفظ الذكية', `<div class="wrap xpage">
   <div class="xhead"><span class="xbadge">${ico('cards', 26)}</span><div><h2>بطاقات الحفظ الذكية</h2><p>طريقة <b>التكرار المتباعد</b>: البطاقة التي تعرفها تنتقل إلى صندوق أعلى وتظهر لك أقل، والتي تخطئ فيها تعود إلى البداية وتتكرر حتى تثبت في ذاكرتك.</p></div></div>
   ${gradeTabs(g, 'cards')}
   ${all.length ? `<div class="leit">${['جديدة', 'أتعلّمها', 'أراجعها', 'أتقنتها'].map((t, i) => `<div class="lb l${i}"><b>${AR(cnt[i])}</b><span>${t}</span></div>`).join('')}</div>
   <div class="mastery" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="نسبة الإتقان"><i style="width:${pct}%"></i></div><p class="mnote">أتقنت ${AR(pct)}٪ من بطاقات الصف ${GN[g]} (${nAR(all.length, 'card')})</p>
   <div class="cta"><button class="q" id="cStart"><span class="ci">${ico('play', 22)}</span><span>ابدأ جلسة مراجعة<small>${nAR(Math.min(15, all.length), 'card')} مختارة حسب حاجتك</small></span></button>
   <button class="r" id="cReset"><span class="ci">${ico('reset', 22)}</span><span>ابدأ من جديد<small>تصفير صناديق هذا الصف</small></span></button></div>` : emptyState('cards', 'لا توجد بطاقات لهذا الصف بعد', '')}
  </div>`);
  wireGradeTabs();
  if (!all.length) return;
  $('#cStart').onclick = () => go('cardrun-g' + g);
  $('#cReset').onclick = e => { const b = e.currentTarget; if (b.dataset.sure) { const S = store.get('bioLeitner', {}); all.forEach(k => delete S[k.id]); store.set('bioLeitner', S); cardsHome(g); toast('صُفّرت صناديق بطاقات الصف ' + GN[g]); } else { b.dataset.sure = 1; b.classList.add('confirm'); b.querySelector('small').textContent = 'اضغط مرة ثانية للتأكيد'; } };
}
let CR = null;
function cardsRun(g) {
  hideTabs();
  const S = store.get('bioLeitner', {}), all = cardsOf(g);
  all.forEach(k => k.box = S[k.id] || 0);
  all.sort((a, b) => a.box - b.box || Math.random() - .5);
  CR = { g, list: all.slice(0, 15), i: 0, ok: 0 };
  shell('مراجعة بطاقات الصف ' + GN[g], '<div class="wrap quiz" id="cr"></div>'); cShow();
}
function cShow() {
  const R = CR, box = $('#cr');
  if (R.i >= R.list.length) { box.innerHTML = `<div class="qcard score"><div>انتهت الجلسة</div><b>${AR(R.ok)} / ${AR(R.list.length)}</b><p>عرفتها من أول مرة. البطاقات الصعبة ستظهر لك أكثر في الجلسة القادمة.</p><button class="qnext" id="again">${ico('reset', 18)}جلسة جديدة</button><button class="qnext alt" id="back">${ico('cards', 18)}صناديق البطاقات</button></div>`; $('#again').onclick = () => cardsRun(R.g); $('#back').onclick = () => go('cards-g' + R.g); return; }
  const k = R.list[R.i]; $('#prog').style.width = (R.i / R.list.length * 100) + '%';
  box.innerHTML = `<div class="fcard" id="fc" tabindex="0" role="button" aria-label="اقلب البطاقة"><div class="fin"><div class="fcf"><span class="qtag" style="--cc:${k.c.c}">${k.c.t}</span><div class="fq">${k.q}</div><small class="hint">${ico('flip', 16)}اضغط لقلب البطاقة</small></div><div class="fcb"><div class="fa">${k.a}</div></div></div></div>
   <div class="fbtns" id="fbt" hidden><button class="no" id="fNo">${ico('reset', 18)}لم أعرفها</button><button class="yes" id="fYes">${ico('check', 18)}عرفتها</button></div>
   <p class="mnote">بطاقة ${AR(R.i + 1)} من ${AR(R.list.length)}، الصندوق ${AR(k.box + 1)}</p>`;
  const flip = () => { $('#fc').classList.add('flip'); $('#fbt').hidden = false; };
  $('#fc').onclick = flip; $('#fc').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } };
  const mark = good => { const S = store.get('bioLeitner', {}); S[k.id] = good ? Math.min(3, (S[k.id] || 0) + 1) : 0; store.set('bioLeitner', S); if (good) R.ok++; R.i++; cShow(); };
  $('#fYes').onclick = () => mark(true); $('#fNo').onclick = () => mark(false);
}

// ---------- contact ----------
function contactHtml() {
  const C = CONTACT, row = (cls, icon, label, val, href, shown) => `<div class="crow ${cls}"><span class="cic">${ico(icon, 16)}<span>${label}</span></span>${val ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(shown || val)}</a><button class="copy" data-v="${esc(val)}" aria-label="نسخ ${label}">${ico('copy', 15)}<span>نسخ</span></button>` : '<em>يُضاف قريبًا</em>'}</div>`;
  return `<div class="contact"><div class="chd"><span class="cav">${ico('user', 26)}</span><div><small>للتواصل مع معدّ الملازم</small><b>${C.name}</b><small>بكالوريوس في علوم الحياة، ماجستير في علم الأحياء المجهرية</small></div></div>
   ${row('fbk', 'facebook', 'فيسبوك', C.facebook, C.facebook, 'صفحة الأستاذ على فيسبوك')}
   ${row('ig', 'instagram', 'إنستغرام', C.instagram, C.instagram, '@biohmt')}
   ${row('ph', 'phone', 'الهاتف', C.phone, 'tel:' + C.phone.replace(/\s/g, ''))}
   ${row('em', 'mail', 'البريد', C.email, 'mailto:' + C.email)}</div>`;
}
function copyText(v) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(v);
  return new Promise((res, rej) => { const t = document.createElement('textarea'); t.value = v; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) { } t.remove(); ok ? res() : rej(); });
}
function wireCopy() {
  document.querySelectorAll('.copy').forEach(b => b.onclick = () => {
    const lab = b.querySelector('span');
    copyText(b.dataset.v).then(() => { lab.textContent = 'تم النسخ'; b.classList.add('ok'); toast('تم النسخ إلى الحافظة'); setTimeout(() => { lab.textContent = 'نسخ'; b.classList.remove('ok'); }, 1600); },
      () => toast('تعذّر النسخ، اضغط مطوّلًا على النص لنسخه', 'bad'));
  });
}
function contactPage() {
  tabbar('me');
  shell('تواصل مع الأستاذ', `<div class="wrap xpage">${contactHtml()}
   <div class="about"><h3 class="sec-h">عن الملازم</h3><p>ملازم علم الأحياء التفاعلية للصفوف الأول والثاني والثالث المتوسط، والرابع العلمي، والسادس العلمي، وفق منهج وزارة التربية العراقية: شرح مبسّط، رسوم توضيحية ومجسّمات ثلاثية الأبعاد، اختبارات تفاعلية، وبطاقات حفظ ذكية، مع الأسئلة الوزارية لصف السادس العلمي.</p></div></div>`);
  wireCopy();
}
