// ===== Motion-graphics chapter summaries: «شاهد ملخص الفصل - موشن غرافيك» =====
// BOOK.motion["g2-c1"] = {url, poster, seconds} comes from src/data/motionVideos.json (motion-generator/).
// The video is streamed from its link, so it is not part of the APK/AAB.
ICON.film = '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M3 15h18M8 4v5M16 4v5M8 15v5M16 15v5"/>';
ICON.expand = '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';

const motionOf = (g, n) => (BOOK.motion || {})['g' + g + '-c' + n];

function motionCard(g, c) {
  const m = motionOf(g, c.n);
  if (!m) return '';
  return `<div class="mcard" id="mcard" role="region" aria-label="ملخص الفصل بالموشن غرافيك">
    <button class="mopen" id="mopen" type="button">
      <span class="mthumb">${m.poster ? `<img src="${m.poster}" alt="" loading="lazy">` : ''}<span class="mplay">${ico('play', 30)}</span></span>
      <span class="mtxt"><small>${ico('film', 15)}موشن غرافيك، ${AR(m.seconds || 60)} ثانية</small><span class="mt">شاهد ملخص الفصل</span><span>${c.t} في أقل من دقيقتين، بصوت وترجمة عربية</span></span>
    </button>
  </div>`;
}

function motionMount(g, c, root) {
  const m = motionOf(g, c.n), card = root.querySelector('#mcard');
  if (!m || !card) return;
  // after the chapter opener, before the first lesson
  const open = root.querySelector('.ch-open, .unit-open');
  if (open) open.after(card);
  card.querySelector('#mopen').onclick = () => motionPlay(card, m, c);
}

function motionPlay(card, m, c) {
  const RATES = [0.75, 1, 1.25, 1.5];
  card.classList.add('on');
  card.innerHTML = `<div class="mhead"><span class="mt">${ico('film', 18)}ملخص الفصل: ${c.t}</span><button class="mx" id="mclose" type="button" aria-label="أغلق الفيديو">${ico('x', 20)}</button></div>
    <div class="mframe"><video id="mvid" src="${m.url}" ${m.poster ? `poster="${m.poster}"` : ''} controls playsinline preload="metadata" controlslist="nodownload"></video></div>
    <div class="mbar">
      <div class="mspeed" role="group" aria-label="سرعة التشغيل">${RATES.map(r => `<button type="button" data-r="${r}" aria-pressed="${r === 1}">${AR(String(r).replace('.', '٫'))}×</button>`).join('')}</div>
      <button class="mfs" id="mfs" type="button">${ico('expand', 18)}ملء الشاشة</button>
    </div>
    <p class="merr" id="merr" hidden>تعذّر تشغيل الفيديو. يحتاج الملخص إلى اتصال بالإنترنت؛ اتصل ثم <button type="button" id="mretry">أعد المحاولة</button>.</p>`;
  const v = card.querySelector('#mvid');
  v.play().catch(() => {});
  card.querySelectorAll('.mspeed button').forEach(b => b.onclick = () => {
    v.playbackRate = +b.dataset.r;
    card.querySelectorAll('.mspeed button').forEach(x => x.setAttribute('aria-pressed', x === b));
  });
  card.querySelector('#mfs').onclick = () => {
    const f = v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen;
    if (f) Promise.resolve(f.call(v)).catch(() => {});
  };
  v.onerror = () => { card.querySelector('#merr').hidden = false; };
  card.querySelector('#mretry').onclick = () => { card.querySelector('#merr').hidden = true; v.load(); v.play().catch(() => {}); };
  card.querySelector('#mclose').onclick = () => {
    v.pause();
    const fresh = document.createElement('div');
    fresh.innerHTML = motionCard(G.id, c);
    card.replaceWith(fresh.firstElementChild);
    motionMount(G.id, c, $('#view'));
  };
}
