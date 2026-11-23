// ===== Chapter motion graphic: «شاهد ملخص الفصل - موشن غرافيك» (music only, no narration) =====
// BOOK.motion["g2-c1"] holds the chapter's scene data (app/motion/g2/c1.json, linked by app/link_motion.py).
// motion_engine.js (global MG) turns it into one animated SVG and a music score; this file is the player.
// Everything runs inside the app, so it works offline and adds nothing to download.
ICON.film = '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M3 15h18M8 4v5M16 4v5M8 15v5M16 15v5"/>';
ICON.expand = '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>';
ICON.shrink = '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>';
ICON.pause = '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
ICON.vol = '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>';
ICON.mute = '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>';

const motionOf = (g, n) => (BOOK.motion || {})['g' + g + '-c' + n];
function motionMeta(g, c) {
  const gr = BOOK.grades.find((x) => x.id == g) || {};
  return { key: 'g' + g + '-c' + c.n, grade: gr.name || '', gradeId: +g, n: c.n, title: c.t, color: c.c || gr.c };
}
const mclock = (s) => AR(Math.floor(s / 60)) + ':' + AR(String(Math.floor(s % 60)).padStart(2, '0'));

function motionCard(g, c) {
  const m = motionOf(g, c.n);
  if (!m || typeof MG === 'undefined') return '';
  const secs = Math.round(MG.timeline(m).total);
  return `<div class="mcard" id="mcard" role="region" aria-label="ملخص الفصل بالموشن غرافيك">
    <button class="mopen" id="mopen" type="button" aria-label="شاهد ملخص الفصل، موشن غرافيك بموسيقى فقط، ${AR(secs)} ثانية">
      <span class="mthumb" aria-hidden="true">${MG.svg(m, motionMeta(g, c), { only: 0, static: true })}<span class="mplay">${ico('play', 30)}</span></span>
      <span class="mtxt"><small>${ico('film', 15)}موشن غرافيك، ${AR(secs)} ثانية، موسيقى فقط</small><span class="mt">شاهد ملخص الفصل</span><span>${c.t} بالحركة والصورة في أقل من دقيقة</span></span>
    </button>
  </div>`;
}

function motionMount(g, c, root) {
  const m = motionOf(g, c.n), card = root.querySelector('#mcard');
  if (!m || !card) return;
  const open = root.querySelector('.ch-open, .unit-open');   // after the chapter opener, before the first lesson
  if (open) open.after(card);
  card.querySelector('#mopen').onclick = () => motionPlay(card, m, g, c);
}

function motionPlay(card, data, g, c) {
  const meta = motionMeta(g, c), tl = MG.timeline(data), total = tl.total;
  const RATES = [0.75, 1, 1.25, 1.5];
  card.classList.add('on');
  card.innerHTML = `<div class="mhead"><span class="mt">${ico('film', 18)}ملخص الفصل: ${c.t}</span><button class="mx" id="mclose" type="button" aria-label="أغلق الموشن غرافيك">${ico('x', 20)}</button></div>
    <div class="mplayer" id="mplayer"><div class="mstage" id="mstage" tabindex="0" aria-label="الموشن غرافيك؛ المسافة للتشغيل والإيقاف، والأسهم للتقديم والإرجاع">${MG.svg(data, meta)}
      <button class="mbig" id="mbig" type="button" aria-label="شغّل" hidden>${ico('play', 34)}</button></div>
    <div class="mctl">
      <button class="mbtn" id="mpp" type="button" aria-label="أوقف مؤقتًا">${ico('pause', 20)}</button>
      <input class="mseek" id="mseek" type="range" min="0" max="${Math.round(total * 10)}" value="0" step="1" aria-label="موضع العرض">
      <span class="mtime" id="mtime" dir="ltr">${mclock(0)} / ${mclock(total)}</span>
      <button class="mbtn" id="mmute" type="button" aria-pressed="false" aria-label="اكتم الموسيقى">${ico('vol', 20)}</button>
      <button class="mbtn" id="mfs" type="button" aria-label="ملء الشاشة">${ico('expand', 20)}</button>
    </div></div>
    <div class="mbar"><div class="mspeed" role="group" aria-label="سرعة العرض">${RATES.map((r) => `<button type="button" data-r="${r}" aria-pressed="${r === 1}">${AR(String(r).replace('.', '٫'))}×</button>`).join('')}</div>
      <span class="mnote">موسيقى هادئة للدراسة، بلا تعليق صوتي</span></div>`;

  const $c = (s) => card.querySelector(s), stage = $c('#mstage'), box = $c('#mplayer'), svg = stage.querySelector('svg');
  const pp = $c('#mpp'), big = $c('#mbig'), seek = $c('#mseek'), time = $c('#mtime'), mute = $c('#mmute'), fs = $c('#mfs');
  svg.getBoundingClientRect();                                   // make sure the CSS animations exist
  const anims = svg.getAnimations({ subtree: true });
  anims.forEach((a) => a.pause());

  // ---- one clock drives the picture (every animation is seeked to it) and the music ----
  let t = 0, rate = 1, playing = false, muted = false, last = 0, raf = 0, dead = false;
  const notes = MG.score(meta, total, tl.scenes.map((x) => x.s));
  let ctx = null, ch = null, cursor = 0;

  const paint = () => {
    const ms = t * 1000;
    for (const a of anims) a.currentTime = ms;
    seek.value = Math.round(t * 10);
    time.textContent = mclock(t) + ' / ' + mclock(total);
  };
  const audioStop = () => {
    if (!ch) return;
    const old = ch; ch = null;
    try { old.master.gain.cancelScheduledValues(ctx.currentTime); old.master.gain.setTargetAtTime(0, ctx.currentTime, 0.05); setTimeout(() => old.master.disconnect(), 400); } catch (e) { /* context closed */ }
  };
  const audioStart = () => {
    try {
      if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC(); }
      if (ctx.state === 'suspended') ctx.resume();
      ch = MG.chain(ctx, total);
      ch.master.gain.setValueAtTime(0, ctx.currentTime);
      ch.master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, ctx.currentTime + 0.5);
      // notes already sounding at t (long pads) start now with what is left of them
      for (const n of notes) if (n.t < t && n.t + n.d > t + 0.3) MG.voice(ctx, ch.input, n, ctx.currentTime + 0.02, (n.t + n.d - t) / rate);
      cursor = t;
    } catch (e) { ch = null; }
  };
  const schedule = () => {
    if (!ch || !ctx) return;
    const until = t + 1.2 * rate;
    for (const n of notes) {
      if (n.t < cursor || n.t >= until) continue;
      MG.voice(ctx, ch.input, n, ctx.currentTime + 0.05 + (n.t - t) / rate, Math.min(n.d, total - n.t) / rate);
    }
    cursor = until;
  };
  const tick = (now) => {
    if (!document.contains(card)) return stop();                 // the chapter page was left
    if (playing) {
      t = Math.min(total, t + ((now - last) / 1000) * rate); last = now;
      schedule(); paint();
      if (t >= total) pause();
    }
    raf = playing ? requestAnimationFrame(tick) : 0;
  };
  function play() {
    if (dead) return;
    if (t >= total - 0.05) t = 0;
    playing = true; last = performance.now(); big.hidden = true;
    pp.innerHTML = ico('pause', 20); pp.setAttribute('aria-label', 'أوقف مؤقتًا');
    audioStart(); paint();
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function pause() {
    playing = false; audioStop();
    pp.innerHTML = ico('play', 20); pp.setAttribute('aria-label', 'شغّل');
    bigState();
  }
  // the large centre button: play while paused, replay at the end
  function bigState() {
    const end = t >= total - 0.05;
    big.hidden = playing; big.setAttribute('aria-label', end ? 'أعد العرض' : 'شغّل'); big.innerHTML = ico(end ? 'reset' : 'play', 34);
  }
  function stop() {
    dead = true; playing = false; cancelAnimationFrame(raf); raf = 0; audioStop();
    document.removeEventListener('visibilitychange', onHide);
    if (ctx) setTimeout(() => { try { ctx.close(); } catch (e) { /* already closed */ } }, 500);
  }
  const jump = (to) => { t = Math.max(0, Math.min(total, to)); if (playing) { audioStop(); audioStart(); } else bigState(); paint(); };
  const onHide = () => { if (document.hidden && playing) pause(); };
  document.addEventListener('visibilitychange', onHide);

  pp.onclick = () => (playing ? pause() : play());
  big.onclick = play;
  seek.oninput = () => jump(seek.value / 10);
  stage.onkeydown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); playing ? pause() : play(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); jump(t + 5); }    // right-to-left: left is forward
    else if (e.key === 'ArrowRight') { e.preventDefault(); jump(t - 5); }
  };
  stage.onclick = (e) => { if (e.target === stage || e.target.closest('svg')) playing ? pause() : play(); };
  card.querySelectorAll('.mspeed button').forEach((b) => b.onclick = () => {
    rate = +b.dataset.r;
    card.querySelectorAll('.mspeed button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    if (playing) { audioStop(); audioStart(); }
  });
  mute.onclick = () => {
    muted = !muted;
    mute.setAttribute('aria-pressed', muted); mute.setAttribute('aria-label', muted ? 'شغّل الموسيقى' : 'اكتم الموسيقى');
    mute.innerHTML = ico(muted ? 'mute' : 'vol', 20);
    if (ch && ctx) ch.master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.08);
  };
  // full screen: the browser's own when it can (Android WebView shows it through onShowCustomView), else a full-window view
  const isFull = () => document.fullscreenElement === box || document.webkitFullscreenElement === box || box.classList.contains('mfull');
  const fsIcon = () => { const f = isFull(); fs.innerHTML = ico(f ? 'shrink' : 'expand', 20); fs.setAttribute('aria-label', f ? 'اخرج من ملء الشاشة' : 'ملء الشاشة'); };
  fs.onclick = () => {
    if (isFull()) {
      if (document.fullscreenElement || document.webkitFullscreenElement) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else box.classList.remove('mfull');
    } else {
      const req = box.requestFullscreen || box.webkitRequestFullscreen;
      if (req) Promise.resolve(req.call(box)).catch(() => box.classList.add('mfull')); else box.classList.add('mfull');
    }
    setTimeout(fsIcon, 150);
  };
  box.addEventListener('fullscreenchange', fsIcon); box.addEventListener('webkitfullscreenchange', fsIcon);
  box.addEventListener('keydown', (e) => { if (e.key === 'Escape' && box.classList.contains('mfull')) { box.classList.remove('mfull'); fsIcon(); } });

  $c('#mclose').onclick = () => {
    stop();
    const fresh = document.createElement('div');
    fresh.innerHTML = motionCard(g, c);
    card.replaceWith(fresh.firstElementChild);
    motionMount(g, c, $('#view'));
    $('#mopen') && $('#mopen').focus();
  };
  paint(); play(); stage.focus({ preventScroll: true });
}
