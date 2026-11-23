/* ===== Motion-graphics engine: music-only chapter summaries (no narration) =====
   One chapter = data (app/motion/g<grade>/c<chapter>.json) → one SVG whose CSS animations make a single timeline,
   plus a calm music score generated from the chapter key and played with Web Audio.
   Used two ways:
     • the app: this file is concatenated into index.html (build_shell.py) → global MG, played by motion_player.js
     • motion-generator: imported as a CommonJS module to export the same motion graphic as an MP4 (optional)
   Every animation is a CSS animation, so the player can pause, seek and change speed through element.getAnimations(). */
(function (root) {
  'use strict';
  const W = 1600, H = 900;
  const r2 = (n) => Math.round(n * 100) / 100;
  const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const PAL = ['#34d399', '#7dd3fc', '#fbbf24', '#fda4af', '#c4b5fd', '#5eead4', '#fdba74', '#a5b4fc'];
  const col = (i) => PAL[i % PAL.length];

  /* ---------- colour helpers ---------- */
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

  /* ---------- seeded randomness (same chapter → same picture and music) ---------- */
  function rng(seed) {
    let h = 2166136261;
    for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  /* ---------- text: Arabic, right-to-left, wrapped by an estimate of Cairo's glyph width ---------- */
  function lines(str, maxW, size) {
    const max = Math.max(4, Math.floor(maxW / (size * 0.5)));
    const out = []; let cur = '';
    for (const w of String(str).split(/\s+/)) {
      const t = cur ? cur + ' ' + w : w;
      if (t.length > max && cur) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  // align: 'r' right edge at x (reading start), 'c' centred, 'l' left edge at x
  function T(x, y, str, o) {
    o = o || {};
    const size = o.size || 34, lh = size * (o.lh || 1.38);
    const ls = o.maxW ? lines(str, o.maxW, size) : [String(str)];
    const anchor = o.align === 'c' ? 'middle' : o.align === 'l' ? 'end' : 'start';
    const y0 = o.vc === false ? y : y - ((ls.length - 1) * lh) / 2;
    return `<text x="${x}" y="${r2(y0)}" direction="rtl" text-anchor="${anchor}" dominant-baseline="central" font-size="${size}" font-weight="${o.w || 700}" fill="${o.fill || '#fff'}"` +
      `${o.maxW ? ` data-w="${o.maxW}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}${o.d != null ? ` style="--d:${r2(o.d)}s"` : ''}>` +
      ls.map((l, i) => `<tspan x="${x}" dy="${i ? r2(lh) : 0}">${esc(l)}</tspan>`).join('') + '</text>';
  }
  const G = (cls, d, inner, extra) => `<g class="${cls}" style="--d:${r2(d)}s;${extra || ''}">${inner}</g>`;
  const at = (x, y, inner) => `<g transform="translate(${x} ${y})">${inner}</g>`;
  // a stroke that draws itself, then optionally keeps flowing
  const draw = (d, path, stroke, w, extra) => `<path class="w" style="--d:${r2(d)}s" d="${path}" pathLength="1" fill="none" stroke="${stroke}" stroke-width="${w || 6}" stroke-linecap="round" stroke-linejoin="round"${extra || ''}/>`;
  // n dots travelling a path forever (offset-path), spread evenly over one lap
  function travellers(d, path, n, dur, fill, r, shape) {
    let s = '';
    for (let k = 0; k < n; k++) {
      const body = shape === 'drop' ? `<path d="M0 -${r * 1.6} C${r} -${r * 0.4} ${r} ${r} 0 ${r} C-${r} ${r} -${r} -${r * 0.4} 0 -${r * 1.6}Z" fill="${fill}"/>`
        : shape === 'dia' ? `<rect x="-${r}" y="-${r}" width="${r * 2}" height="${r * 2}" rx="${r * 0.3}" transform="rotate(45)" fill="${fill}"/>`
          : `<circle r="${r}" fill="${fill}"/>`;
      s += `<g class="mv" style="--d:${r2(d + (dur * k) / n)}s;--t:${dur}s;offset-path:path('${path}')">${body}</g>`;
    }
    return s;
  }
  // arrow from (x1,y1) to (x2,y2): drawn line + head that pops when the line arrives
  function arrow(d, x1, y1, x2, y2, c, bend) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - (bend || 0);
    const p = bend ? `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`;
    const a = Math.atan2(y2 - (bend ? my : y1), x2 - (bend ? mx : x1)) * 180 / Math.PI;
    return draw(d, p, c, 6) + `<g transform="translate(${x2} ${y2}) rotate(${r2(a)})"><path class="p" style="--d:${r2(d + 0.8)}s" d="M4 0 L-18 -13 L-18 13Z" fill="${c}"/></g>`;
  }

  /* ---------- the stylesheet that drives every animation ---------- */
  const CSS = `
.mg text{font-family:Cairo,Tajawal,system-ui,sans-serif}
.mg .sc{animation:mgIn .7s ease var(--s) both,mgOut .7s ease var(--e) forwards}
.mg .f{animation:mgFade .9s ease var(--d) both}
.mg .u{animation:mgUp .9s cubic-bezier(.2,.8,.2,1) var(--d) both}
.mg .p{transform-box:fill-box;transform-origin:center;animation:mgPop .75s cubic-bezier(.3,1.45,.5,1) var(--d) both}
.mg .w{stroke-dasharray:1 1;animation:mgDraw var(--dw,1.3s) ease-in-out var(--d) both}
.mg .gx{transform-box:fill-box;transform-origin:center;animation:mgGx .9s cubic-bezier(.2,.8,.2,1) var(--d) both}
.mg .lp{transform-box:fill-box;transform-origin:center;animation:mgPop .75s cubic-bezier(.3,1.45,.5,1) var(--d) both,mgPulse 2.6s ease-in-out calc(var(--d) + .8s) infinite}
.mg .hb{transform-box:fill-box;transform-origin:center;animation:mgPop .75s ease var(--d) both,mgBeat 1s ease-in-out calc(var(--d) + .8s) infinite}
.mg .br{transform-box:fill-box;transform-origin:center top;animation:mgFade .8s ease var(--d) both,mgBreath 4s ease-in-out var(--d) infinite}
.mg .ls{transform-box:fill-box;transform-origin:center;animation:mgFade .8s ease var(--d) both,mgSpin var(--t,14s) linear var(--d) infinite}
.mg .lo{animation:mgFade .8s ease var(--d) both,mgSpin var(--t,8s) linear var(--d) infinite}
.mg .lb{animation:mgBob var(--t,6s) ease-in-out var(--d) infinite alternate}
.mg .lf{stroke-dasharray:14 18;animation:mgFade .8s ease var(--d) both,mgDash 1.1s linear var(--d) infinite}
.mg .lx{animation:mgSlide var(--t,4s) linear var(--d) infinite}
.mg .mv{offset-rotate:0deg;opacity:0;animation:mgMove var(--t,3s) linear var(--d) infinite}
.mg .mvx{animation:mgShift 1.6s cubic-bezier(.45,0,.2,1) var(--d) both}
.mg .flex{transform-box:view-box;animation:mgFlex 3.2s ease-in-out var(--d) infinite alternate}
.mg .bulge{transform-box:fill-box;transform-origin:center;animation:mgBulge 3.2s ease-in-out var(--d) infinite alternate}
.mg .smoke{transform-box:fill-box;transform-origin:center;opacity:0;animation:mgSmoke 4.5s ease-out var(--d) infinite}
.mg .rain{animation:mgRain 1.4s linear var(--d) infinite}
@keyframes mgIn{from{opacity:0}to{opacity:1}}
@keyframes mgOut{from{opacity:1}to{opacity:0}}
@keyframes mgFade{from{opacity:0}to{opacity:1}}
@keyframes mgUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
@keyframes mgPop{0%{opacity:0;transform:scale(.2)}100%{opacity:1;transform:scale(1)}}
@keyframes mgDraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes mgGx{from{opacity:0;transform:scaleX(.05)}to{opacity:1;transform:scaleX(1)}}
@keyframes mgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes mgBeat{0%,100%{transform:scale(1)}14%{transform:scale(1.09)}28%{transform:scale(.98)}42%{transform:scale(1.05)}}
@keyframes mgBreath{0%,100%{transform:scale(.95)}50%{transform:scale(1.05)}}
@keyframes mgSpin{to{transform:rotate(360deg)}}
@keyframes mgBob{from{transform:translateY(-16px)}to{transform:translateY(16px)}}
@keyframes mgDash{to{stroke-dashoffset:-32}}
@keyframes mgSlide{from{transform:translateX(0)}to{transform:translateX(var(--sx,-200px))}}
@keyframes mgMove{0%{offset-distance:0%;opacity:0}8%{opacity:1}92%{opacity:1}100%{offset-distance:100%;opacity:0}}
@keyframes mgShift{from{transform:translate(0,0)}to{transform:translate(var(--dx,0),var(--dy,0))}}
@keyframes mgFlex{from{transform:rotate(0)}to{transform:rotate(var(--rot,-60deg))}}
@keyframes mgBulge{from{transform:scale(1)}to{transform:scale(1.28,1.16)}}
@keyframes mgSmoke{0%{opacity:0;transform:translateY(0) scale(.5)}15%{opacity:.75}100%{opacity:0;transform:translateY(-190px) scale(1.7)}}
@keyframes mgRain{from{transform:translateY(-40px);opacity:0}20%{opacity:.9}to{transform:translateY(120px);opacity:0}}
.mg.static *{animation:none!important}`;

  /* ---------- scene durations (seconds) ---------- */
  const DUR = {
    title: () => 6, summary: (s) => 4.5 + s.points.length * 1.3, points: (s) => 4 + s.points.length * 1.4,
    flow: (s) => 5 + s.steps.length * 1.2, cycle: (s) => 5.5 + s.steps.length * 1.1, hierarchy: (s) => 4.5 + s.levels.length * 0.85,
    compare: (s) => 5 + (s.right.points.length + s.left.points.length) * 0.7, cell: (s) => 5 + s.labels.length * 0.9,
    division: () => 11, dna: (s) => 6 + (s.labels || []).length * 0.8, organ: (s) => 6 + (s.labels || []).length * 0.9, punnett: () => 9,
  };
  const SCENE_TYPES = Object.keys(DUR).filter((t) => t !== 'title');

  function timeline(data) {
    const all = [{ type: 'title' }].concat(data.scenes);
    let s = 0;
    const tl = all.map((sc) => { const d = Math.min(14, DUR[sc.type](sc)); const o = { sc, s, d }; s += d; return o; });
    return { scenes: tl, total: s + 0.8 };
  }

  /* ---------- shared pieces ---------- */
  function heading(s, cap, acc) {
    return `<rect class="gx" style="--d:${r2(s + 0.25)}s" x="1526" y="86" width="10" height="64" rx="5" fill="${acc}"/>` +
      T(1500, 118, cap, { size: 52, w: 800, cls: 'u', d: s + 0.2 });
  }
  // a numbered list down the right side (used beside cells and organ drawings)
  function sideList(s, labels, x0, x1) {
    x0 = x0 || 1060; x1 = x1 || 1500;
    const n = labels.length, step = Math.min(96, 560 / Math.max(n, 1)), y0 = 520 - ((n - 1) * step) / 2;
    return labels.map((l, i) => {
      const y = y0 + i * step, d = s + 1.2 + i * 0.75, c = col(i);
      return `<g class="u" style="--d:${r2(d)}s"><rect x="${x0}" y="${r2(y - step * 0.4)}" width="${x1 - x0}" height="${r2(step * 0.8)}" rx="${r2(step * 0.4)}" fill="rgba(255,255,255,.07)" stroke="${c}" stroke-opacity=".45" stroke-width="2"/>` +
        `<circle cx="${x1 - 36}" cy="${r2(y)}" r="20" fill="${c}"/>` + T(x1 - 36, y, AR(i + 1), { size: 24, w: 800, fill: '#06281f', align: 'c' }) +
        T(x1 - 72, y, l, { size: 29, maxW: x1 - x0 - 100, lh: 1.15 }) + '</g>';
    }).join('');
  }

  /* ---------- scene renderers: (scene, start, duration, palette) → SVG ---------- */
  const R = {};

  R.title = function (sc, s, d, P) {
    return G('p', s + 0.3, `<circle cx="800" cy="300" r="74" fill="${P.acc}"/>`) +
      T(800, 304, AR(P.n), { size: 76, w: 800, fill: '#062a20', align: 'c', cls: 'p', d: s + 0.45 }) +
      T(800, 186, P.grade, { size: 34, w: 700, fill: P.soft, align: 'c', cls: 'f', d: s + 0.2 }) +
      T(800, 470, P.title, { size: 84, w: 800, align: 'c', maxW: 1300, cls: 'u', d: s + 0.75 }) +
      (P.idea ? T(800, 610, P.idea, { size: 38, w: 600, fill: P.soft, align: 'c', maxW: 1200, cls: 'u', d: s + 1.5 }) : '') +
      G('f', s + 2.2, `<rect x="640" y="705" width="320" height="58" rx="29" fill="rgba(255,255,255,.1)"/>`) +
      T(800, 734, 'ملخّص بصري، موسيقى فقط', { size: 26, w: 700, fill: P.soft, align: 'c', cls: 'f', d: s + 2.3 });
  };

  R.flow = function (sc, s, d, P) {
    const n = sc.steps.length, circ = sc.shape === 'circle';
    const gap = 70, bw = Math.min(circ ? 250 : 300, (1380 - (n - 1) * gap) / n), cy = 500;
    const xs = sc.steps.map((_, i) => 1490 - bw / 2 - i * (bw + gap)); // first step on the right (reading start)
    const size = n >= 5 ? 26 : n === 4 ? 29 : 33;
    let o = heading(s, sc.cap, P.acc);
    sc.steps.forEach((t, i) => {
      const x = xs[i], dd = s + 0.7 + i * 0.95, c = col(i);
      const shape = circ ? `<circle cx="${r2(x)}" cy="${cy}" r="${r2(bw / 2)}" fill="rgba(255,255,255,.07)" stroke="${c}" stroke-width="5"/>`
        : `<rect x="${r2(x - bw / 2)}" y="${cy - 130}" width="${r2(bw)}" height="260" rx="34" fill="rgba(255,255,255,.07)" stroke="${c}" stroke-width="5"/>`;
      o += G('p', dd, shape + `<circle cx="${r2(x)}" cy="${circ ? r2(cy - bw / 2) : cy - 130}" r="30" fill="${c}"/>` +
        T(x, circ ? cy - bw / 2 : cy - 130, AR(i + 1), { size: 30, w: 800, fill: '#06281f', align: 'c' }) +
        T(x, cy + 6, t, { size, maxW: bw - (circ ? 60 : 40), align: 'c', lh: 1.25 }));
      if (i < n - 1) o += arrow(dd + 0.45, r2(x - bw / 2 - 8), cy, r2(xs[i + 1] + bw / 2 + 12), cy, '#e2fbf1');
    });
    const path = `M${r2(xs[0])} ${cy + 175} L${r2(xs[n - 1])} ${cy + 175}`;
    o += draw(s + 0.7 + n * 0.95, path, 'rgba(255,255,255,.18)', 4) + travellers(s + 1 + n * 0.95, path, 3, 3.6, P.acc, 11);
    return o;
  };

  R.cycle = function (sc, s, d, P) {
    const n = sc.steps.length, cx = 800, cy = 510, Rr = n > 4 ? 275 : 255, nr = n > 4 ? 98 : 108;
    const pt = (i) => { const a = (-90 + (360 * i) / n) * Math.PI / 180; return [cx + Rr * Math.cos(a), cy + Rr * Math.sin(a)]; };
    let o = heading(s, sc.cap, P.acc);
    o += `<g class="lo" style="--d:${r2(s + 1)}s;--t:9s;transform-origin:${cx}px ${cy}px"><circle cx="${cx}" cy="${cy - Rr}" r="13" fill="${P.acc}"/></g>`;
    o += `<circle class="f" style="--d:${r2(s + 0.5)}s" cx="${cx}" cy="${cy}" r="${Rr}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="3"/>`;
    sc.steps.forEach((t, i) => {
      const [x, y] = pt(i), dd = s + 0.8 + i * 0.85, c = col(i);
      o += G('p', dd, `<circle cx="${r2(x)}" cy="${r2(y)}" r="${nr}" fill="${mix(P.bg, c, 0.22)}" stroke="${c}" stroke-width="5"/>` +
        T(x, y, t, { size: n > 4 ? 25 : 28, maxW: nr * 1.6, align: 'c', lh: 1.2 }));
      const [x2, y2] = pt(i + 1), a1 = Math.atan2(y - cy, x - cx), a2 = Math.atan2(y2 - cy, x2 - cx);
      const da = nr / Rr * 1.05, b1 = a1 + da, b2 = a2 - da;
      const p1 = [cx + Rr * Math.cos(b1), cy + Rr * Math.sin(b1)], p2 = [cx + Rr * Math.cos(b2), cy + Rr * Math.sin(b2)];
      const ang = (b2 * 180) / Math.PI + 90;
      o += draw(dd + 0.4, `M${r2(p1[0])} ${r2(p1[1])} A${Rr} ${Rr} 0 0 1 ${r2(p2[0])} ${r2(p2[1])}`, '#e2fbf1', 6) +
        `<g transform="translate(${r2(p2[0])} ${r2(p2[1])}) rotate(${r2(ang)})"><path class="p" style="--d:${r2(dd + 1.2)}s" d="M4 0 L-18 -13 L-18 13Z" fill="#e2fbf1"/></g>`;
    });
    if (sc.center) o += G('p', s + 0.6, `<circle cx="${cx}" cy="${cy}" r="${Rr - nr - 34}" fill="rgba(255,255,255,.08)"/>`) +
      T(cx, cy, sc.center, { size: 32, w: 800, maxW: (Rr - nr - 40) * 1.7, align: 'c', cls: 'f', d: s + 0.9, fill: P.soft });
    return o;
  };

  R.hierarchy = function (sc, s, d, P) {
    const n = sc.levels.length, top = 200, avail = sc.note ? 580 : 640, bh = Math.min(84, avail / n - 10), step = bh + 10;
    const wide = sc.shape === 'pyramid'; // pyramid: widest at the bottom; funnel (default): widest at the top
    let o = heading(s, sc.cap, P.acc);
    sc.levels.forEach((t, i) => {
      const f = n === 1 ? 1 : i / (n - 1), w = 1200 - (wide ? 1 - f : f) * 760, y = top + i * step + (avail - n * step) / 2;
      o += `<g class="gx" style="--d:${r2(s + 0.6 + i * 0.7)}s"><rect x="${r2(800 - w / 2)}" y="${r2(y)}" width="${r2(w)}" height="${r2(bh)}" rx="${r2(bh / 2)}" fill="${col(i)}"/>` +
        T(800, y + bh / 2, t, { size: Math.min(36, bh * 0.5), w: 800, fill: '#06281f', align: 'c' }) + '</g>';
    });
    if (sc.note) o += T(800, 850, sc.note, { size: 30, fill: P.soft, align: 'c', maxW: 1300, cls: 'f', d: s + 0.8 + n * 0.7 });
    return o;
  };

  R.compare = function (sc, s, d, P) {
    let o = heading(s, sc.cap, P.acc);
    [[sc.right, 1490, 0], [sc.left, 790, 1]].forEach(([side, xr, k]) => {
      const c = k ? PAL[2] : PAL[0], dd = s + 0.6 + k * 0.5, xl = xr - 680;
      o += G('u', dd, `<rect x="${xl}" y="200" width="680" height="${640}" rx="36" fill="rgba(255,255,255,.07)" stroke="${c}" stroke-opacity=".55" stroke-width="3"/>` +
        `<rect x="${xl}" y="200" width="680" height="12" rx="6" fill="${c}"/>` + T(xr - 44, 280, side.title, { size: 42, w: 800, fill: c, maxW: 600 }));
      const m = side.points.length, step = Math.min(130, 470 / m);
      side.points.forEach((p, j) => {
        const y = 390 + j * step, dj = s + 1.5 + k * 0.6 + j * 0.65;
        o += G('u', dj, `<circle cx="${xr - 56}" cy="${r2(y)}" r="10" fill="${c}"/>` + T(xr - 84, y, p, { size: 31, maxW: 560, w: 600, lh: 1.25 }));
      });
    });
    return o;
  };

  R.points = function (sc, s, d, P) {
    const n = sc.points.length, step = Math.min(132, 600 / n), y0 = 520 - ((n - 1) * step) / 2;
    let o = heading(s, sc.cap, P.acc);
    sc.points.forEach((p, i) => {
      const y = y0 + i * step, dd = s + 0.8 + i * 1.1, c = col(i);
      o += G('u', dd, `<rect x="140" y="${r2(y - step * 0.42)}" width="1360" height="${r2(step * 0.84)}" rx="28" fill="rgba(255,255,255,.06)"/>` +
        `<circle cx="1444" cy="${r2(y)}" r="27" fill="${c}"/><path d="M1431 ${r2(y)} l9 9 l17 -19" fill="none" stroke="#06281f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
        T(1396, y, p, { size: n > 4 ? 32 : 36, maxW: 1200, w: 600, lh: 1.22 }));
    });
    return o;
  };

  R.summary = function (sc, s, d, P) {
    return R.points({ cap: sc.cap || 'الخلاصة', points: sc.points }, s, d, P) +
      T(800, 862, 'ملازم الأحياء التفاعلية', { size: 24, fill: P.soft, align: 'c', cls: 'f', d: s + d - 2.2 });
  };

  /* --- cells: organelles drawn once; numbered pins land on the organelle each label names --- */
  const ORG = [
    [/جدار/, 'wall'], [/غشاء|البلازمي/, 'mem'], [/مايتو|ميتو/, 'mito'], [/كولجي|جولجي/, 'golgi'], [/شبكة|إندوبلازم|اندوبلازم/, 'er'],
    [/رايبو|ريبو/, 'ribo'], [/فجوة/, 'vac'], [/بلاستيد|كلوروبلاست|صانع/, 'chl'], [/سوط|أسواط|اسواط/, 'flag'],
    [/المادة الوراثية|DNA|نووية/, 'dna'], [/نوي/, 'nucleolus'], [/نواة|النواة/, 'nuc'], [/سايتو|سيتو|هيولى/, 'cyto'], [/جسيم مركزي|مريكز/, 'cent'], [/محفظة|كبسول/, 'caps'],
  ];
  const CELL_AT = {
    animal: { mem: [-215, -120], nuc: [-10, 10], nucleolus: [10, 25], mito: [140, 90], golgi: [-120, 120], er: [90, -60], ribo: [150, -120], cyto: [-140, -10], cent: [100, 150], vac: [-80, -150] },
    plant: { wall: [-262, -150], mem: [-236, 40], nuc: [120, -110], nucleolus: [130, -100], vac: [-20, 30], chl: [-180, 150], mito: [180, 140], golgi: [150, 20], er: [60, -170], ribo: [-150, -170], cyto: [-200, 120] },
    bacteria: { wall: [-250, -60], mem: [-228, 40], dna: [0, 0], ribo: [140, 60], flag: [330, 10], cyto: [-120, 50], caps: [-262, -100] },
  };
  function cellArt(v, s, P) {
    let o = '';
    if (v === 'plant') {
      o += `<rect class="p" style="--d:${r2(s + 0.5)}s" x="-280" y="-230" width="560" height="460" rx="30" fill="#14532d" stroke="#86efac" stroke-width="10"/>` +
        `<rect class="p" style="--d:${r2(s + 0.7)}s" x="-255" y="-205" width="510" height="410" rx="22" fill="#166534" stroke="#bbf7d0" stroke-width="4"/>` +
        G('p', s + 1, '<rect x="-150" y="-70" width="260" height="210" rx="70" fill="#7dd3fc" fill-opacity=".35" stroke="#bae6fd" stroke-width="3"/>') +
        G('p', s + 1.2, '<circle cx="120" cy="-110" r="62" fill="#a78bfa"/><circle cx="130" cy="-100" r="20" fill="#5b21b6"/>');
      [[-180, 150], [-60, 170], [200, -10], [-200, -120]].forEach(([x, y], i) => { o += G('p', s + 1.4 + i * 0.12, `<ellipse cx="${x}" cy="${y}" rx="44" ry="24" fill="#22c55e" stroke="#bbf7d0" stroke-width="3"/><path d="M${x - 30} ${y} h60 M${x - 26} ${y - 8} h52 M${x - 26} ${y + 8} h52" stroke="#14532d" stroke-width="3"/>`); });
      o += G('p', s + 1.6, '<ellipse cx="180" cy="140" rx="40" ry="22" fill="#fb923c"/><path d="M150 140 q15 -14 30 0 t30 0" stroke="#7c2d12" stroke-width="3" fill="none"/>') +
        G('p', s + 1.7, '<path d="M120 0 h70 M125 20 h60 M130 40 h50" stroke="#fde68a" stroke-width="7" stroke-linecap="round"/>') +
        G('f', s + 1.8, '<path d="M20 -175 q30 -15 60 0 t60 0 M20 -150 q30 -15 60 0 t60 0" stroke="#f9a8d4" stroke-width="4" fill="none"/><g fill="#fef08a"><circle cx="-150" cy="-170" r="5"/><circle cx="-130" cy="-180" r="5"/><circle cx="-160" cy="-150" r="5"/></g>');
    } else if (v === 'bacteria') {
      o += `<rect class="p" style="--d:${r2(s + 0.5)}s" x="-290" y="-150" width="580" height="300" rx="150" fill="none" stroke="#fde68a" stroke-opacity=".5" stroke-width="16"/>` +
        `<rect class="p" style="--d:${r2(s + 0.6)}s" x="-265" y="-128" width="530" height="256" rx="128" fill="#0e7490" stroke="#a5f3fc" stroke-width="8"/>` +
        draw(s + 1.1, 'M-120 0 c20 -60 60 60 90 0 s70 -60 100 0 s60 50 70 -10', '#fbbf24', 7) +
        G('f', s + 1.3, '<g fill="#e0f2fe"><circle cx="140" cy="60" r="7"/><circle cx="170" cy="40" r="7"/><circle cx="120" cy="-60" r="7"/><circle cx="-160" cy="60" r="7"/><circle cx="-180" cy="-50" r="7"/></g>') +
        `<path class="w lf" style="--d:${r2(s + 1.5)}s" d="M265 0 c40 -30 60 30 100 0 s60 -30 90 0" fill="none" stroke="#a5f3fc" stroke-width="6" stroke-linecap="round"/>`;
    } else {
      o += `<path class="p" style="--d:${r2(s + 0.5)}s" d="M-240 -40 C-250 -200 -40 -250 90 -220 C240 -190 280 -40 250 80 C220 210 40 250 -90 220 C-230 190 -235 100 -240 -40Z" fill="#7f1d1d" fill-opacity=".55" stroke="#fda4af" stroke-width="8"/>` +
        G('lp', s + 1, '<circle cx="-10" cy="10" r="78" fill="#a78bfa" stroke="#ede9fe" stroke-width="5"/><circle cx="10" cy="25" r="24" fill="#5b21b6"/>') +
        G('p', s + 1.3, '<ellipse cx="140" cy="90" rx="52" ry="26" fill="#fb923c"/><path d="M100 90 q20 -16 40 0 t40 0" stroke="#7c2d12" stroke-width="4" fill="none"/>') +
        G('p', s + 1.4, '<path d="M-170 100 q50 -22 100 0 M-165 122 q45 -20 90 0 M-160 144 q40 -18 80 0" stroke="#fde68a" stroke-width="8" fill="none" stroke-linecap="round"/>') +
        G('f', s + 1.5, '<path d="M50 -80 q25 -20 50 0 t50 0 M50 -55 q25 -20 50 0 t50 0" stroke="#f9a8d4" stroke-width="5" fill="none"/><g fill="#fef08a"><circle cx="150" cy="-120" r="6"/><circle cx="170" cy="-135" r="6"/><circle cx="130" cy="-140" r="6"/><circle cx="-100" cy="-150" r="6"/></g>') +
        G('p', s + 1.6, '<g stroke="#e9d5ff" stroke-width="6"><path d="M90 150 v26 M80 163 h20"/><path d="M114 140 v26 M104 153 h20"/></g>');
    }
    return o;
  }
  R.cell = function (sc, s, d, P) {
    const v = CELL_AT[sc.variant] ? sc.variant : 'animal', pos = CELL_AT[v];
    let o = heading(s, sc.cap, P.acc), pins = '';
    sc.labels.forEach((l, i) => {
      const key = (ORG.find(([re]) => re.test(l)) || [0, 'cyto'])[1];
      const [x, y] = pos[key] || pos.cyto || [0, 0];
      pins += G('p', s + 1.2 + i * 0.75, `<circle cx="${x}" cy="${y}" r="22" fill="${col(i)}" stroke="#06281f" stroke-width="4"/>` + T(x, y, AR(i + 1), { size: 24, w: 800, fill: '#06281f', align: 'c' }));
    });
    return o + at(540, 520, cellArt(v, s, P) + pins) + sideList(s, sc.labels);
  };

  /* --- cell division: phases appear and give way in order --- */
  R.division = function (sc, s, d, P) {
    const meio = sc.variant === 'meiosis';
    const names = sc.phases && sc.phases.length ? sc.phases : (meio ? ['الخلية الأم', 'تضاعف وتقابل', 'الانقسام الأول', 'الانقسام الثاني', 'أربع خلايا أحادية'] : ['الطور التمهيدي', 'الطور الاستوائي', 'الطور الانفصالي', 'الطور النهائي', 'خليتان متماثلتان']);
    const k = names.length, w = 9 / k, win = (i) => `--s:${r2(s + 0.6 + i * w)}s;--e:${r2(s + 0.6 + (i + 1) * w - 0.35)}s`;
    const chrom = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M-14 -26 L14 26 M14 -26 L-14 26" stroke="${c}" stroke-width="11" stroke-linecap="round"/></g>`;
    const cellC = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0e7490" fill-opacity=".45" stroke="#a5f3fc" stroke-width="7"/>`;
    let o = heading(s, sc.cap, P.acc);
    const stages = [
      cellC(0, 0, 210) + `<circle cx="0" cy="0" r="90" fill="#a78bfa" fill-opacity=".5" stroke="#ede9fe" stroke-width="4"/>` + chrom(-30, -10, '#f472b6') + chrom(30, 20, '#38bdf8'),
      cellC(0, 0, 210) + `<path d="M-200 0 L0 -150 L200 0 L0 150Z" fill="none" stroke="#e2fbf1" stroke-opacity=".35" stroke-width="3"/><path d="M0 -170 V170" stroke="#fbbf24" stroke-dasharray="10 10" stroke-width="4"/>` + chrom(0, -70, '#f472b6') + chrom(0, 0, '#38bdf8') + chrom(0, 70, '#fbbf24'),
      cellC(0, 0, 220) + `<g class="mvx" style="--d:${r2(s + 0.6 + 2 * w + 0.3)}s;--dx:-110px">${chrom(-20, -60, '#f472b6')}${chrom(-20, 10, '#38bdf8')}${chrom(-20, 80, '#fbbf24')}</g><g class="mvx" style="--d:${r2(s + 0.6 + 2 * w + 0.3)}s;--dx:110px">${chrom(20, -60, '#f472b6')}${chrom(20, 10, '#38bdf8')}${chrom(20, 80, '#fbbf24')}</g>`,
      `<path d="M-250 -170 C-20 -200 -20 -40 0 0 C-20 40 -20 200 -250 170 C-330 120 -330 -120 -250 -170Z M250 -170 C20 -200 20 -40 0 0 C20 40 20 200 250 170 C330 120 330 -120 250 -170Z" fill="#0e7490" fill-opacity=".45" stroke="#a5f3fc" stroke-width="7"/>` + chrom(-180, -40, '#f472b6') + chrom(-180, 40, '#38bdf8') + chrom(180, -40, '#f472b6') + chrom(180, 40, '#38bdf8'),
      meio ? [[-330, -120], [-110, -120], [110, -120], [330, -120]].map(([x]) => `<g class="p" style="--d:${r2(s + 0.6 + 4 * w)}s">${cellC(x, 0, 95)}<circle cx="${x}" cy="0" r="38" fill="#a78bfa" fill-opacity=".6"/></g>`).join('')
        : [-210, 210].map((x) => `<g class="p" style="--d:${r2(s + 0.6 + 4 * w)}s">${cellC(x, 0, 170)}<circle cx="${x}" cy="0" r="68" fill="#a78bfa" fill-opacity=".55" stroke="#ede9fe" stroke-width="4"/></g>`).join(''),
    ];
    stages.slice(0, Math.max(k, 1)).forEach((st, i) => { o += `<g class="sc" style="${win(i)}">${at(800, 500, st)}</g>`; });
    names.forEach((nm, i) => {
      o += `<g class="sc" style="${win(i)}"><rect x="560" y="770" width="480" height="70" rx="35" fill="${col(i)}"/>${T(800, 805, nm, { size: 32, w: 800, fill: '#06281f', align: 'c' })}</g>`;
    });
    return o;
  };

  /* --- DNA double helix --- */
  R.dna = function (sc, s, d, P) {
    const per = 260, amp = 110, cy = 440, x0 = 150;
    let a = '', b = '', rungs = '';
    for (let x = 0; x <= 1300 + per; x += 10) {
      const t = (x / per) * 2 * Math.PI;
      a += (x ? 'L' : 'M') + r2(x) + ' ' + r2(amp * Math.sin(t)); b += (x ? 'L' : 'M') + r2(x) + ' ' + r2(-amp * Math.sin(t));
    }
    const pairs = [['#f472b6', '#38bdf8'], ['#fbbf24', '#34d399']];
    for (let x = 20, i = 0; x <= 1300 + per; x += 32, i++) {
      const y = amp * Math.sin((x / per) * 2 * Math.PI), pr = pairs[i % 2];
      rungs += `<path d="M${x} ${r2(y)} V0" stroke="${pr[0]}" stroke-width="9"/><path d="M${x} 0 V${r2(-y)}" stroke="${pr[1]}" stroke-width="9"/>`;
    }
    let o = heading(s, sc.cap, P.acc) + `<defs><clipPath id="mgDnaClip"><rect x="${x0}" y="${cy - 170}" width="1300" height="340" rx="40"/></clipPath></defs>` +
      `<g clip-path="url(#mgDnaClip)"><g class="f" style="--d:${r2(s + 0.5)}s"><g transform="translate(${x0} ${cy})"><g class="lx" style="--d:${r2(s + 0.5)}s;--t:5s;--sx:-${per}px">${rungs}<path d="${a}" fill="none" stroke="#e2fbf1" stroke-width="12"/><path d="${b}" fill="none" stroke="#c4b5fd" stroke-width="12"/></g></g></g></g>`;
    const L = sc.labels || [], n = L.length, w = Math.min(420, 1300 / Math.max(n, 1) - 20);
    L.forEach((l, i) => {
      const x = 1450 - w / 2 - i * (w + 20);
      o += G('u', s + 1.5 + i * 0.8, `<rect x="${r2(x - w / 2)}" y="690" width="${r2(w)}" height="130" rx="26" fill="rgba(255,255,255,.07)" stroke="${col(i)}" stroke-width="3"/>` + T(x, 755, l, { size: 29, maxW: w - 30, align: 'c', lh: 1.2 }));
    });
    return o;
  };

  /* --- Punnett square --- */
  R.punnett = function (sc, s, d, P) {
    const p1 = sc.p1 || ['A', 'a'], p2 = sc.p2 || ['A', 'a'], cs = 150, x0 = 640, y0 = 330;
    let o = heading(s, sc.cap, P.acc);
    o += T(800, 230, `${p1.join('')}  ×  ${p2.join('')}`, { size: 44, w: 800, align: 'c', cls: 'u', d: s + 0.5, fill: P.soft });
    p1.forEach((g, i) => { o += T(x0 + cs * (1.5 - i) + cs / 2 - cs / 2, y0 - 40, g, { size: 46, w: 800, align: 'c', cls: 'p', d: s + 1 + i * 0.3, fill: PAL[0] }); });
    p2.forEach((g, j) => { o += T(x0 - 50 + 2 * cs + 110, y0 + cs / 2 + j * cs, g, { size: 46, w: 800, align: 'c', cls: 'p', d: s + 1.5 + j * 0.3, fill: PAL[2] }); });
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const x = x0 + (1 - i) * cs, y = y0 + j * cs, g = [p1[i], p2[j]].sort((a, b) => (a === a.toUpperCase() ? 0 : 1) - (b === b.toUpperCase() ? 0 : 1)).join('');
      o += G('p', s + 2.4 + (j * 2 + i) * 0.55, `<rect x="${x + 6}" y="${y + 6}" width="${cs - 12}" height="${cs - 12}" rx="20" fill="${/[A-Z]/.test(g) ? 'rgba(52,211,153,.25)' : 'rgba(251,191,36,.25)'}" stroke="#e2fbf1" stroke-width="3"/>` + T(x + cs / 2, y + cs / 2, g, { size: 46, w: 800, align: 'c' }));
    }
    if (sc.note) o += T(800, 700 + 90, sc.note, { size: 36, w: 800, align: 'c', maxW: 1300, cls: 'u', d: s + 5, fill: PAL[0] });
    return o;
  };

  /* --- organ / process drawings (local coordinates, centred on 0,0) --- */
  const ART = {};
  ART.heart = (s) => {
    const top = 'M-70 -150 C-200 -330 200 -330 70 -150', bot = 'M70 120 C260 330 -260 330 -70 120';
    return draw(s + 0.5, top, '#60a5fa', 10) + draw(s + 0.6, bot, '#f87171', 10) +
      G('hb', s + 0.4, '<path d="M0 130 C-190 20 -230 -140 -110 -190 C-45 -215 0 -165 0 -120 C0 -165 45 -215 110 -190 C230 -140 190 20 0 130Z" fill="#dc2626" stroke="#fecaca" stroke-width="6"/><path d="M0 -120 V120" stroke="#7f1d1d" stroke-width="5"/><path d="M-110 -40 H110" stroke="#7f1d1d" stroke-width="4" stroke-dasharray="10 10"/>') +
      travellers(s + 1.3, top, 4, 3, '#93c5fd', 11) + travellers(s + 1.3, bot, 4, 3.4, '#fca5a5', 11) +
      T(0, -310, 'الرئتان', { size: 28, align: 'c', cls: 'f', d: s + 1, fill: '#bfdbfe' }) + T(0, 300, 'الجسم', { size: 28, align: 'c', cls: 'f', d: s + 1, fill: '#fecaca' });
  };
  ART.lungs = (s) => {
    const air = 'M0 -300 V-120 C-20 -100 -70 -90 -110 -40';
    return draw(s + 0.4, 'M0 -300 V-120 M0 -120 C-20 -100 -70 -90 -110 -40 M0 -120 C20 -100 70 -90 110 -40', '#e2fbf1', 16) +
      G('br', s + 0.6, '<path d="M-30 -110 C-90 -200 -250 -150 -260 40 C-265 190 -150 230 -40 190 C-20 120 -20 0 -30 -110Z" fill="#f472b6" fill-opacity=".55" stroke="#fbcfe8" stroke-width="6"/><path d="M30 -110 C90 -200 250 -150 260 40 C265 190 150 230 40 190 C20 120 20 0 30 -110Z" fill="#f472b6" fill-opacity=".55" stroke="#fbcfe8" stroke-width="6"/>') +
      travellers(s + 1.2, air, 4, 2.6, '#7dd3fc', 10) + travellers(s + 2.5, 'M110 -40 C70 -90 20 -100 0 -120 V-300', 4, 2.6, '#cbd5e1', 9) +
      T(-200, -270, 'O₂', { size: 34, align: 'c', cls: 'f', d: s + 1.2, fill: '#7dd3fc' }) + T(200, -270, 'CO₂', { size: 34, align: 'c', cls: 'f', d: s + 2.5, fill: '#cbd5e1' });
  };
  ART.alveolus = (s) => {
    const into = 'M-40 -40 C-20 40 0 100 0 170', out = 'M60 170 C70 100 70 40 50 -40';
    return G('br', s + 0.4, '<circle cx="0" cy="-60" r="200" fill="#7dd3fc" fill-opacity=".18" stroke="#bae6fd" stroke-width="8"/>') +
      draw(s + 0.8, 'M-330 200 C-150 120 150 120 330 200', '#ef4444', 46) +
      travellers(s + 1.4, into, 4, 2.4, '#7dd3fc', 12) + travellers(s + 1.8, out, 4, 2.4, '#cbd5e1', 11) +
      T(-140, -60, 'O₂', { size: 40, align: 'c', cls: 'f', d: s + 1.3, fill: '#7dd3fc' }) + T(140, -60, 'CO₂', { size: 40, align: 'c', cls: 'f', d: s + 1.7, fill: '#e2e8f0' }) +
      T(0, 270, 'شُعيرة دموية', { size: 28, align: 'c', cls: 'f', d: s + 1, fill: '#fecaca' });
  };
  ART.leaf = (s) => {
    const co2 = 'M-420 -40 C-330 -60 -260 -30 -180 -10', o2 = 'M60 -80 C140 -170 230 -220 330 -270', h2o = 'M-330 300 C-310 200 -280 120 -230 70';
    return `<g transform="translate(-300 -250)"><g class="ls" style="--d:${r2(s + 0.4)}s;--t:20s">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M0 -95 V-130" transform="rotate(${a})" stroke="#fde68a" stroke-width="8" stroke-linecap="round"/>`).join('')}</g><circle class="p" style="--d:${r2(s + 0.3)}s" r="62" fill="#fbbf24"/></g>` +
      draw(s + 0.6, 'M-330 310 C-300 200 -270 120 -230 70', '#65a30d', 12) +
      G('p', s + 0.7, '<path d="M-250 70 C-170 -190 150 -230 290 -60 C160 110 -110 170 -250 70Z" fill="#16a34a" stroke="#bbf7d0" stroke-width="6"/>') +
      draw(s + 1.2, 'M-240 64 C-80 20 120 -20 280 -60', '#bbf7d0', 5) + draw(s + 1.4, 'M-120 30 L-60 -80 M0 10 L70 -110 M100 -20 L170 -120 M-60 40 L0 110 M60 10 L130 80', '#bbf7d0', 3) +
      travellers(s + 1.6, co2, 3, 2.6, '#cbd5e1', 11) + travellers(s + 2, o2, 3, 2.6, '#7dd3fc', 11) + travellers(s + 1.8, h2o, 3, 2.4, '#38bdf8', 9, 'drop') +
      T(-430, -90, 'CO₂', { size: 32, align: 'c', cls: 'f', d: s + 1.5, fill: '#e2e8f0' }) + T(370, -300, 'O₂', { size: 32, align: 'c', cls: 'f', d: s + 1.9, fill: '#7dd3fc' }) +
      T(-380, 300, 'ماء', { size: 30, align: 'c', cls: 'f', d: s + 1.7, fill: '#7dd3fc' }) + T(40, 30, 'سكر', { size: 32, align: 'c', cls: 'p', d: s + 3, fill: '#fde68a' });
  };
  ART.plant = (s) => {
    const up = 'M-12 300 V-170', down = 'M12 -170 V300';
    return draw(s + 0.4, 'M-420 300 H420', '#a16207', 10) +
      draw(s + 0.6, 'M0 300 C-30 340 -80 360 -120 400 M0 300 C30 350 60 360 110 390 M0 300 V400', '#d6a46a', 7) +
      `<rect class="gx" style="--d:${r2(s + 0.7)}s" x="-30" y="-180" width="60" height="480" rx="20" fill="#15803d"/>` +
      G('p', s + 1, '<path d="M0 -60 C-120 -160 -260 -120 -280 -60 C-200 -10 -90 -10 0 -60Z" fill="#22c55e"/><path d="M0 -140 C120 -240 260 -200 280 -140 C200 -90 90 -90 0 -140Z" fill="#22c55e"/>') +
      draw(s + 1.2, up, '#38bdf8', 6) + draw(s + 1.3, down, '#fb923c', 6) +
      travellers(s + 1.6, up, 5, 3.2, '#7dd3fc', 9, 'drop') + travellers(s + 2, down, 5, 3.6, '#fdba74', 9, 'dia') +
      T(-60, 200, 'خشب: ماء وأملاح ↑', { size: 26, align: 'r', cls: 'f', d: s + 1.5, fill: '#7dd3fc' }) + T(60, 200, 'لحاء: غذاء ↓', { size: 26, align: 'l', cls: 'f', d: s + 1.9, fill: '#fdba74' });
  };
  ART.neuron = (s) => {
    const axon = 'M-250 0 C-120 -30 60 30 250 0';
    let m = '';
    [-170, -90, -10, 70, 150].forEach((x, i) => { m += G('p', s + 1.2 + i * 0.15, `<rect x="${x}" y="${x < 0 ? -26 + x * 0.06 : -14}" width="58" height="34" rx="17" fill="#fde68a" fill-opacity=".9"/>`); });
    return draw(s + 0.4, 'M-330 0 L-420 -110 M-330 0 L-440 30 M-330 0 L-400 130 M-390 -80 L-430 -150 M-410 100 L-460 120', '#c4b5fd', 6) +
      G('p', s + 0.3, '<circle cx="-310" cy="0" r="70" fill="#7c3aed" stroke="#ddd6fe" stroke-width="6"/><circle cx="-310" cy="0" r="24" fill="#ddd6fe"/>') +
      draw(s + 0.8, axon, '#ddd6fe', 12) + m + draw(s + 1.8, 'M250 0 L330 -70 M250 0 L340 0 M250 0 L330 70', '#ddd6fe', 7) +
      G('p', s + 2.1, '<g fill="#f0abfc"><circle cx="340" cy="-74" r="14"/><circle cx="350" cy="0" r="14"/><circle cx="340" cy="74" r="14"/></g>') +
      travellers(s + 2.2, axon, 2, 1.8, '#fbbf24', 16) +
      T(0, 120, 'السيال العصبي ←', { size: 30, align: 'c', cls: 'f', d: s + 2.2, fill: '#fde68a' });
  };
  ART.brain = (s) => {
    const n1 = 'M0 60 V330', n2 = 'M0 180 C-80 200 -200 240 -330 300', n3 = 'M0 180 C80 200 200 240 330 300';
    return G('lp', s + 0.4, '<path d="M-230 20 C-280 -110 -170 -230 -40 -220 C0 -250 60 -250 100 -220 C230 -230 300 -100 240 20 C260 90 170 120 100 100 C40 130 -60 130 -120 100 C-200 120 -270 90 -230 20Z" fill="#f9a8d4" fill-opacity=".75" stroke="#fce7f3" stroke-width="6"/><path d="M0 -230 V110 M-170 -120 c40 30 40 80 0 110 M-90 -190 c30 40 30 100 -10 130 M170 -120 c-40 30 -40 80 0 110 M90 -190 c-30 40 -30 100 10 130" stroke="#be185d" stroke-width="5" fill="none"/>') +
      draw(s + 0.9, n1, '#e9d5ff', 14) + draw(s + 1.1, n2, '#e9d5ff', 7) + draw(s + 1.2, n3, '#e9d5ff', 7) +
      travellers(s + 1.6, n2, 2, 2, '#fbbf24', 12) + travellers(s + 1.9, 'M330 300 C200 240 80 200 0 180 V60', 2, 2, '#34d399', 12) +
      T(-300, 350, 'أعصاب حسية', { size: 26, align: 'c', cls: 'f', d: s + 1.6, fill: '#fde68a' }) + T(300, 350, 'أعصاب حركية', { size: 26, align: 'c', cls: 'f', d: s + 1.9, fill: '#6ee7b7' });
  };
  ART.gut = (s) => {
    const path = 'M0 -300 V-170 C0 -130 40 -120 80 -100 C180 -60 160 30 60 40 C0 46 -60 40 -80 70 C-120 120 -10 140 40 128 C110 112 140 160 80 190 C20 220 -100 200 -80 250 C-60 290 40 290 60 320';
    return draw(s + 0.4, path, '#fb7185', 30) + draw(s + 0.5, path, '#fecdd3', 8) +
      G('lp', s + 1, '<ellipse cx="110" cy="-50" rx="95" ry="62" fill="#f43f5e" fill-opacity=".55" stroke="#fecdd3" stroke-width="5"/>') +
      travellers(s + 1.6, path, 3, 6, '#a16207', 15) +
      T(-130, -260, 'الفم والمريء', { size: 26, align: 'c', cls: 'f', d: s + 1, fill: '#fecdd3' }) + T(300, -50, 'المعدة', { size: 28, align: 'c', cls: 'f', d: s + 1.2, fill: '#fecdd3' }) + T(-280, 140, 'الأمعاء', { size: 28, align: 'c', cls: 'f', d: s + 1.4, fill: '#fecdd3' });
  };
  ART.kidney = (s) => {
    const art = 'M380 -60 C260 -60 160 -40 60 -20', ure = 'M-40 120 C-30 200 -10 240 0 290';
    return draw(s + 0.4, art, '#ef4444', 18) + draw(s + 0.5, 'M60 30 C160 40 260 50 380 50', '#3b82f6', 18) +
      G('p', s + 0.3, '<path d="M-60 -220 C-260 -200 -280 120 -80 170 C20 190 60 120 20 70 C-10 40 -10 -40 30 -80 C80 -140 40 -230 -60 -220Z" fill="#b91c1c" stroke="#fecaca" stroke-width="7"/><path d="M-30 -60 C-120 -20 -120 40 -40 90" stroke="#fde68a" stroke-width="8" fill="none"/>') +
      draw(s + 0.8, ure, '#fde68a', 12) + G('p', s + 1, '<ellipse cx="0" cy="320" rx="90" ry="50" fill="#fde68a" fill-opacity=".5" stroke="#fef9c3" stroke-width="5"/>') +
      travellers(s + 1.2, art, 4, 2.4, '#fca5a5', 11) + travellers(s + 1.8, ure, 3, 2.4, '#fde047', 10, 'drop') +
      T(300, -110, 'دم يحمل الفضلات', { size: 26, align: 'c', cls: 'f', d: s + 1.2, fill: '#fecaca' }) + T(160, 320, 'البول', { size: 28, align: 'c', cls: 'f', d: s + 1.8, fill: '#fef08a' });
  };
  ART.eye = (s) => {
    return G('p', s + 0.3, '<circle cx="90" cy="0" r="200" fill="#f8fafc" fill-opacity=".9" stroke="#e2e8f0" stroke-width="6"/><path d="M-60 -150 C-150 -60 -150 60 -60 150" fill="#bae6fd" fill-opacity=".35" stroke="#7dd3fc" stroke-width="6"/><circle cx="-80" cy="0" r="62" fill="#0ea5e9" fill-opacity=".5"/>') +
      G('p', s + 0.6, '<ellipse cx="-40" cy="0" rx="26" ry="70" fill="#a5f3fc" stroke="#0e7490" stroke-width="4"/>') +
      draw(s + 0.8, 'M250 -150 C300 -60 300 60 250 150', '#f43f5e', 10) +
      G('p', s + 1, '<path d="M-420 60 V-80" stroke="#fbbf24" stroke-width="10" stroke-linecap="round"/><path d="M-440 -60 L-420 -100 L-400 -60Z" fill="#fbbf24"/>') +
      draw(s + 1.4, 'M-420 -90 L-40 -50 L270 40', '#fde68a', 4) + draw(s + 1.5, 'M-420 -90 L-40 0 L270 40', '#fde68a', 4) + draw(s + 1.6, 'M-420 -90 L-40 50 L270 40', '#fde68a', 4) +
      G('lp', s + 2.6, '<circle cx="270" cy="40" r="14" fill="#fbbf24"/>') +
      T(370, 170, 'الشبكية', { size: 26, align: 'c', cls: 'f', d: s + 2.6, fill: '#fecdd3' }) + T(-90, 250, 'العدسة', { size: 26, align: 'c', cls: 'f', d: s + 1, fill: '#a5f3fc' });
  };
  ART.muscle = (s) => {
    return draw(s + 0.3, 'M-40 -300 L-30 0', '#e2e8f0', 22) +
      `<g transform="translate(-30 0)"><g class="flex" style="--d:${r2(s + 1.5)}s;--rot:-62deg;transform-origin:0px 0px"><path d="M0 0 L300 0" stroke="#e2e8f0" stroke-width="20" stroke-linecap="round"/><circle cx="320" cy="0" r="30" fill="#fcd34d"/></g></g>` +
      `<g transform="translate(-5 -150)"><g class="bulge" style="--d:${r2(s + 1.5)}s"><ellipse rx="44" ry="120" fill="#ef4444" fill-opacity=".85" stroke="#fecaca" stroke-width="5"/></g></g>` +
      `<g transform="translate(-75 -150)"><ellipse class="f" style="--d:${r2(s + 0.6)}s" rx="30" ry="110" fill="#b91c1c" fill-opacity=".6"/></g>` +
      G('lp', s + 0.2, '<circle cx="-30" cy="0" r="30" fill="#94a3b8"/>') +
      T(70, 110, 'تنقبض فيُثنى الساعد', { size: 28, align: 'l', cls: 'f', d: s + 1.6, fill: '#fecaca' });
  };
  ART.joint = (s) => {
    return G('p', s + 0.3, '<path d="M-40 -330 h80 v230 c40 10 60 40 40 70 c-20 25 -60 20 -80 10 c-20 10 -60 15 -80 -10 c-20 -30 0 -60 40 -70z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="5"/>') +
      `<g transform="translate(0 0)"><g class="flex" style="--d:${r2(s + 1.4)}s;--rot:-38deg;transform-origin:0px 10px"><path d="M-40 40 c20 -15 60 -15 80 0 v260 h-80z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="5"/></g></g>` +
      G('lp', s + 0.8, '<ellipse cx="0" cy="12" rx="70" ry="22" fill="#7dd3fc" fill-opacity=".55"/>') +
      draw(s + 1, 'M-60 -60 C-90 0 -90 40 -60 90 M60 -60 C90 0 90 40 60 90', '#fbbf24', 5) +
      T(90, 12, 'مفصل', { size: 30, align: 'l', cls: 'f', d: s + 1, fill: '#7dd3fc' }) + T(-110, 30, 'أربطة', { size: 26, align: 'r', cls: 'f', d: s + 1.2, fill: '#fde68a' });
  };
  ART.skeleton = (s) => {
    const b = '#f1f5f9';
    return G('p', s + 0.3, `<circle cx="0" cy="-300" r="58" fill="none" stroke="${b}" stroke-width="10"/><circle cx="-20" cy="-305" r="10" fill="${b}"/><circle cx="20" cy="-305" r="10" fill="${b}"/>`) +
      draw(s + 0.7, 'M0 -240 V60', b, 12) + draw(s + 0.9, 'M-90 -180 C-30 -150 30 -150 90 -180 M-95 -140 C-30 -110 30 -110 95 -140 M-95 -100 C-30 -70 30 -70 95 -100 M-85 -60 C-30 -35 30 -35 85 -60', b, 7) +
      draw(s + 1.2, 'M-120 -200 L-170 -40 L-190 110 M120 -200 L170 -40 L190 110', b, 10) +
      G('p', s + 1.5, `<path d="M-80 60 C-80 120 80 120 80 60 C40 80 -40 80 -80 60Z" fill="none" stroke="${b}" stroke-width="9"/>`) +
      draw(s + 1.7, 'M-50 100 L-70 250 L-75 380 M50 100 L70 250 L75 380', b, 11) +
      `<g class="lb" style="--d:${r2(s + 2.5)}s;--t:3s"><circle cx="0" cy="-200" r="8" fill="#fbbf24"/></g>`;
  };
  ART.microscope = (s) => {
    let cells = '';
    [[330, -170], [400, -110], [300, -90], [370, -210]].forEach(([x, y], i) => { cells += G('p', s + 2 + i * 0.25, `<circle cx="${x}" cy="${y}" r="34" fill="#86efac" fill-opacity=".55" stroke="#dcfce7" stroke-width="4"/><circle cx="${x + 6}" cy="${y - 4}" r="10" fill="#14532d"/>`); });
    return G('p', s + 0.3, '<rect x="-230" y="250" width="300" height="50" rx="16" fill="#94a3b8"/><path d="M40 250 C120 120 120 -60 40 -170" stroke="#cbd5e1" stroke-width="40" fill="none" stroke-linecap="round"/><rect x="-150" y="80" width="230" height="22" rx="8" fill="#64748b"/><g transform="rotate(-18 -60 -80)"><rect x="-95" y="-280" width="70" height="300" rx="20" fill="#e2e8f0"/><rect x="-105" y="-300" width="90" height="40" rx="14" fill="#94a3b8"/><rect x="-80" y="20" width="40" height="60" rx="10" fill="#64748b"/></g>') +
      `<path class="lf" style="--d:${r2(s + 1)}s" d="M-70 240 V100 M-70 70 L-150 -260" stroke="#fde68a" stroke-width="10" stroke-linecap="round" fill="none"/>` +
      G('p', s + 1.6, '<circle cx="350" cy="-150" r="130" fill="#0f172a" stroke="#e2fbf1" stroke-width="8"/>') + cells;
  };
  ART.flower = (s) => {
    let pet = '';
    for (let i = 0; i < 6; i++) pet += `<g transform="rotate(${i * 60} 0 -120)"><ellipse class="p" style="--d:${r2(s + 0.8 + i * 0.12)}s" cx="0" cy="-215" rx="48" ry="88" fill="#f472b6" stroke="#fbcfe8" stroke-width="4"/></g>`;
    const pol = 'M-160 -230 C-120 -330 -40 -320 0 -150';
    return draw(s + 0.3, 'M0 -110 C-20 60 20 200 0 330', '#16a34a', 12) +
      G('p', s + 0.6, '<path d="M0 180 C-120 110 -200 150 -220 200 C-140 230 -60 220 0 180Z" fill="#22c55e"/>') + pet +
      G('p', s + 1.6, '<circle cx="0" cy="-120" r="48" fill="#fbbf24"/><path d="M0 -150 V-200" stroke="#a3e635" stroke-width="8"/><circle cx="0" cy="-205" r="10" fill="#a3e635"/>') +
      G('lb', s + 2, '<g transform="translate(-170 -240)"><ellipse rx="26" ry="18" fill="#fde047"/><path d="M-12 -12 v24 M2 -14 v28" stroke="#1f2937" stroke-width="6"/><ellipse cx="-4" cy="-22" rx="16" ry="10" fill="#e0f2fe" fill-opacity=".85"/></g>', '--t:2.6s') +
      travellers(s + 2.2, pol, 3, 2.6, '#fde047', 9) + T(-260, -150, 'حبوب اللقاح', { size: 26, align: 'c', cls: 'f', d: s + 2.2, fill: '#fef08a' });
  };
  ART.fertilization = (s) => {
    let sp = '';
    [[-60, 0], [-40, -60], [-80, 70]].forEach(([dy], i) => { sp += `<g class="mvx" style="--d:${r2(s + 0.8 + i * 0.3)}s;--dx:${i ? 300 : 410}px;--dy:${i ? (i === 1 ? -20 : 30) : 0}px"><g transform="translate(-430 ${[0, -110, 120][i]})"><ellipse rx="18" ry="12" fill="#e0f2fe"/><path class="lf" style="--d:${r2(s + 0.8)}s" d="M-18 0 c-20 -14 -30 14 -50 0 s-30 -14 -50 0" stroke="#e0f2fe" stroke-width="4" fill="none"/></g></g>`; });
    return G('lp', s + 0.4, '<circle cx="160" cy="0" r="190" fill="#fde68a" fill-opacity=".45" stroke="#fef9c3" stroke-width="8"/><circle cx="160" cy="0" r="60" fill="#fb923c" fill-opacity=".6"/>') + sp +
      `<circle class="p" style="--d:${r2(s + 2.6)}s" cx="160" cy="0" r="214" fill="none" stroke="#34d399" stroke-width="6" stroke-dasharray="12 10"/>` +
      T(160, 260, 'البيضة + النطفة ← البيضة المخصبة', { size: 28, align: 'c', cls: 'f', d: s + 2.8, fill: '#fef08a' });
  };
  ART.embryo = (s) => {
    const st = [[1], [2], [4], [8], ['m'], ['b']], w = 5.6 / st.length;
    const lab = ['الزايكوت', 'خليتان', 'أربع خلايا', 'ثماني خلايا', 'يستمر التفلّج', 'الأريمة'];
    return st.map(([n], i) => {
      let c = '';
      if (n === 'm') for (let k = 0; k < 16; k++) { const a = k * 2.4, rr = 30 + (k % 3) * 40; c += `<circle cx="${r2(rr * Math.cos(a))}" cy="${r2(rr * Math.sin(a))}" r="44" fill="#fdba74" stroke="#fff7ed" stroke-width="4"/>`; }
      else if (n === 'b') for (let k = 0; k < 18; k++) { const a = (k * 2 * Math.PI) / 18; c += `<circle cx="${r2(150 * Math.cos(a))}" cy="${r2(150 * Math.sin(a))}" r="30" fill="#fdba74" stroke="#fff7ed" stroke-width="4"/>`; }
      else { const rr = n === 1 ? 0 : n === 2 ? 70 : n === 4 ? 85 : 110, cr = n === 1 ? 150 : n === 2 ? 90 : n === 4 ? 75 : 58; for (let k = 0; k < n; k++) { const a = (k * 2 * Math.PI) / n; c += `<circle cx="${r2(rr * Math.cos(a))}" cy="${r2(rr * Math.sin(a))}" r="${cr}" fill="#fdba74" stroke="#fff7ed" stroke-width="5"/>`; } }
      return `<g class="sc" style="--s:${r2(s + 0.4 + i * w)}s;--e:${r2(i === st.length - 1 ? s + 30 : s + 0.4 + (i + 1) * w - 0.2)}s"><g class="lp" style="--d:${r2(s + 0.4 + i * w)}s">${c}</g>${T(0, 270, lab[i], { size: 32, w: 800, align: 'c', fill: '#fde68a' })}</g>`;
    }).join('');
  };
  ART.immune = (s) => {
    const vir = (x, y) => `<g transform="translate(${x} ${y})"><circle r="40" fill="#a3e635" fill-opacity=".8"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M0 -40 V-60" transform="rotate(${a})" stroke="#d9f99d" stroke-width="6"/>`).join('')}</g>`;
    const ab = `<path d="M0 30 V-5 L-22 -32 M0 -5 L22 -32" stroke="#fbbf24" stroke-width="9" stroke-linecap="round" fill="none"/>`;
    let o = G('lb', s + 0.2, '<g transform="translate(-250 60)"><circle r="130" fill="#e0e7ff" fill-opacity=".35" stroke="#e0e7ff" stroke-width="6"/><path d="M-40 -20 c20 -40 60 -20 40 10 c40 0 40 50 0 50 c0 30 -60 30 -60 0 c-40 0 -40 -50 20 -60z" fill="#818cf8"/></g>', '--t:4s');
    [[150, -150], [260, 20], [120, 180]].forEach(([x, y], i) => {
      o += `<g class="sc" style="--s:${r2(s + 0.4)}s;--e:${r2(s + 4.5 + i * 0.4)}s"><g class="lb" style="--d:${r2(s)}s;--t:${3 + i}s">${vir(x, y)}</g></g>`;
      o += `<g class="sc" style="--s:${r2(s + 1.5 + i * 0.4)}s;--e:${r2(s + 4.5 + i * 0.4)}s"><g class="mvx" style="--d:${r2(s + 1.5 + i * 0.4)}s;--dx:${x + 200}px;--dy:${y - 60 + 50}px"><g transform="translate(-200 60)">${ab}</g></g></g>`;
    });
    return o + T(0, 330, 'الأجسام المضادة تلتصق بمسبّب المرض فيُقضى عليه', { size: 28, align: 'c', cls: 'f', d: s + 3, fill: '#fde68a', maxW: 900 });
  };
  ART.hormone = (s) => {
    const blood = 'M-250 -170 C-120 -40 100 -100 120 40 C140 160 230 200 260 220';
    return G('lp', s + 0.3, '<ellipse cx="-260" cy="-200" rx="80" ry="58" fill="#c084fc" stroke="#f3e8ff" stroke-width="6"/>') +
      draw(s + 0.7, blood, '#ef4444', 26) +
      G('p', s + 1, '<rect x="200" y="180" width="200" height="140" rx="40" fill="#22d3ee" fill-opacity=".45" stroke="#cffafe" stroke-width="6"/><g fill="#fbbf24"><circle cx="220" cy="190" r="12"/><circle cx="260" cy="182" r="12"/></g>') +
      travellers(s + 1.4, blood, 5, 3.2, '#fde047', 12, 'dia') +
      T(-260, -290, 'غدة صماء', { size: 28, align: 'c', cls: 'f', d: s + 0.6, fill: '#f3e8ff' }) + T(300, 360, 'العضو الهدف', { size: 28, align: 'c', cls: 'f', d: s + 1.2, fill: '#cffafe' }) +
      T(-60, 120, 'الهرمون في الدم', { size: 28, align: 'c', cls: 'f', d: s + 1.5, fill: '#fef08a' });
  };
  ART.ecosystem = (s) => {
    const e1 = 'M-280 -230 C-200 -180 -170 -110 -140 -60', e2 = 'M-80 60 C-20 80 40 90 90 90', e3 = 'M180 60 C220 -20 250 -120 290 -180';
    let rain = '';
    for (let i = 0; i < 6; i++) rain += `<path class="rain" style="--d:${r2(s + 1 + i * 0.23)}s" d="M${70 + i * 32} -230 v26" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round"/>`;
    return `<g transform="translate(-330 -260)"><g class="ls" style="--d:${r2(s + 0.3)}s;--t:20s">${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 -70 V-100" transform="rotate(${a})" stroke="#fde68a" stroke-width="7" stroke-linecap="round"/>`).join('')}</g><circle class="p" style="--d:${r2(s + 0.2)}s" r="52" fill="#fbbf24"/></g>` +
      G('p', s + 0.6, '<ellipse cx="140" cy="-280" rx="110" ry="44" fill="#e2e8f0" fill-opacity=".8"/>') + rain +
      `<rect class="f" style="--d:${r2(s + 0.4)}s" x="-460" y="200" width="920" height="120" rx="30" fill="#365314"/>` +
      G('p', s + 0.8, '<rect x="-150" y="-20" width="34" height="230" fill="#92400e"/><circle cx="-133" cy="-60" r="100" fill="#16a34a"/><circle cx="-60" cy="-20" r="70" fill="#22c55e"/>') +
      G('p', s + 1.3, '<g transform="translate(130 160)"><ellipse rx="62" ry="40" fill="#d6d3d1"/><circle cx="-50" cy="-30" r="26" fill="#d6d3d1"/><ellipse cx="-56" cy="-70" rx="9" ry="26" fill="#d6d3d1"/></g>') +
      G('lb', s + 1.8, '<g transform="translate(300 -200)"><path d="M-60 0 Q-30 -40 0 0 Q30 -40 60 0" stroke="#e7e5e4" stroke-width="10" fill="none" stroke-linecap="round"/></g>', '--t:3s') +
      draw(s + 1.4, e1, '#fde68a', 5) + draw(s + 1.8, e2, '#fde68a', 5) + draw(s + 2.2, e3, '#fde68a', 5) +
      travellers(s + 2.4, e1 + ' ' + e2.replace('M', 'L') + ' ' + e3.replace('M', 'L'), 3, 4, '#fbbf24', 10) +
      T(0, 380, 'الطاقة تنتقل: الشمس ← المنتج ← المستهلكات', { size: 28, align: 'c', cls: 'f', d: s + 2.4, fill: '#fde68a', maxW: 900 });
  };
  ART.factory = (s) => {
    let smoke = '';
    [-170, -60].forEach((x, k) => { for (let i = 0; i < 3; i++) smoke += `<circle class="smoke" style="--d:${r2(s + 1 + k * 0.6 + i * 1.5)}s" cx="${x}" cy="-170" r="40" fill="#64748b"/>`; });
    return smoke + G('p', s + 0.3, '<path d="M-330 200 V0 L-230 -60 V0 L-130 -60 V0 L-30 -60 V200Z" fill="#475569"/><rect x="-195" y="-170" width="50" height="190" fill="#334155"/><rect x="-85" y="-170" width="50" height="190" fill="#334155"/><g fill="#fde68a"><rect x="-290" y="60" width="40" height="40"/><rect x="-200" y="60" width="40" height="40"/><rect x="-110" y="60" width="40" height="40"/></g>') +
      draw(s + 0.8, 'M-30 160 C80 160 100 230 200 230 S360 260 460 250', '#78716c', 24) +
      `<path class="lf" style="--d:${r2(s + 1.2)}s" d="M-30 160 C80 160 100 230 200 230 S360 260 460 250" stroke="#a8a29e" stroke-width="6" fill="none"/>` +
      G('p', s + 1.6, '<g transform="translate(300 60)"><path d="M-60 0 C-30 -40 40 -40 60 0 C40 40 -30 40 -60 0Z" fill="#94a3b8"/><path d="M60 0 L90 -24 V24Z" fill="#94a3b8"/><path d="M-40 -6 l10 10 M-30 -6 l-10 10" stroke="#1e293b" stroke-width="4"/></g>') +
      T(200, 330, 'ملوِّثات الهواء والماء', { size: 28, align: 'c', cls: 'f', d: s + 1.8, fill: '#e2e8f0' });
  };
  ART.cactus = (s) => {
    return `<g transform="translate(260 -260)"><g class="ls" style="--d:${r2(s + 0.3)}s;--t:24s">${[0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 -70 V-100" transform="rotate(${a})" stroke="#fde68a" stroke-width="7" stroke-linecap="round"/>`).join('')}</g><circle class="p" style="--d:${r2(s + 0.2)}s" r="55" fill="#f59e0b"/></g>` +
      `<rect class="f" style="--d:${r2(s + 0.3)}s" x="-420" y="160" width="840" height="60" rx="20" fill="#d6a46a"/>` +
      draw(s + 0.5, 'M-40 220 C-80 280 -60 330 -120 380 M40 220 C70 290 50 330 110 390 M0 220 V400', '#a16207', 7) +
      G('p', s + 0.8, '<rect x="-50" y="-170" width="100" height="340" rx="50" fill="#15803d"/><path d="M-50 20 h-60 a30 30 0 0 1 -30 -30 v-80 a30 30 0 0 1 60 0 v50 h30z M50 -30 h60 a30 30 0 0 0 30 -30 v-70 a30 30 0 0 0 -60 0 v40 h-30z" fill="#16a34a"/><path d="M-20 -150 V160 M20 -150 V160" stroke="#166534" stroke-width="5"/>') +
      G('f', s + 1.4, '<g stroke="#fef3c7" stroke-width="4" stroke-linecap="round"><path d="M-50 -100 l-22 -8 M-50 -40 l-22 -8 M50 -80 l22 -8 M50 40 l22 -8 M-140 -60 l-20 -6 M140 -100 l20 -6 M-50 100 l-22 -8 M50 120 l22 -8"/></g>') +
      T(-260, -40, 'سيقان تخزن الماء', { size: 26, align: 'c', cls: 'f', d: s + 1.6, fill: '#bbf7d0' }) + T(-260, 330, 'جذور عميقة', { size: 26, align: 'c', cls: 'f', d: s + 1.9, fill: '#fde68a' });
  };
  ART.microbes = (s) => {
    return G('lb', s + 0.3, '<g transform="translate(-260 -60)"><rect x="-110" y="-45" width="220" height="90" rx="45" fill="#0e7490" stroke="#a5f3fc" stroke-width="6"/><path d="M110 0 c30 -20 40 20 70 0 s40 -20 60 0" stroke="#a5f3fc" stroke-width="5" fill="none"/></g>', '--t:3s') +
      G('lb', s + 0.9, '<g transform="translate(60 -120)"><circle r="56" fill="#a3e635" fill-opacity=".8"/>' + [0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => `<path d="M0 -56 V-80" transform="rotate(${a})" stroke="#d9f99d" stroke-width="7"/>`).join('') + '</g>', '--t:4s') +
      G('lb', s + 1.5, '<g transform="translate(300 60)"><ellipse rx="70" ry="56" fill="#fde68a" stroke="#fef9c3" stroke-width="5"/><ellipse cx="74" cy="-36" rx="34" ry="28" fill="#fde68a" stroke="#fef9c3" stroke-width="5"/></g>', '--t:5s') +
      G('lb', s + 2.1, '<g transform="translate(-60 170)"><path d="M-90 0 C-110 -70 -20 -90 20 -60 C70 -100 130 -30 100 20 C130 70 40 100 0 70 C-50 100 -120 60 -90 0Z" fill="#c4b5fd" fill-opacity=".7" stroke="#ede9fe" stroke-width="5"/><circle r="22" fill="#6d28d9"/></g>', '--t:3.5s') +
      T(-260, 30, 'بكتريا', { size: 28, align: 'c', cls: 'f', d: s + 0.5, fill: '#a5f3fc' }) + T(60, -10, 'فايروس', { size: 28, align: 'c', cls: 'f', d: s + 1.1, fill: '#d9f99d' }) +
      T(330, 160, 'خميرة (فطر)', { size: 28, align: 'c', cls: 'f', d: s + 1.7, fill: '#fef08a' }) + T(-60, 290, 'أميبا (أوّلي)', { size: 28, align: 'c', cls: 'f', d: s + 2.3, fill: '#ede9fe' });
  };
  ART.aid = (s) => {
    const ecg = 'M-420 200 H-200 L-170 140 L-140 260 L-110 120 L-80 200 H120 L150 140 L180 260 L210 120 L240 200 H420';
    return G('p', s + 0.3, '<rect x="-200" y="-260" width="400" height="300" rx="40" fill="#f8fafc"/><rect x="-60" y="-300" width="120" height="50" rx="16" fill="#cbd5e1"/><path d="M-40 -170 h80 v-0" /><rect x="-34" y="-200" width="68" height="180" rx="10" fill="#dc2626"/><rect x="-90" y="-144" width="180" height="68" rx="10" fill="#dc2626"/>') +
      `<path class="w" style="--d:${r2(s + 0.9)}s;--dw:2.4s" d="${ecg}" pathLength="1" fill="none" stroke="#34d399" stroke-width="7" stroke-linejoin="round"/>` +
      travellers(s + 3.3, ecg, 1, 2.6, '#a7f3d0', 12) +
      T(0, 300, 'اطمئن على التنفس والنبض، واطلب المساعدة', { size: 28, align: 'c', cls: 'f', d: s + 2, fill: '#a7f3d0', maxW: 900 });
  };
  const ORGANS = Object.keys(ART);
  R.organ = function (sc, s, d, P) {
    const L = sc.labels || [];
    const art = (ART[sc.organ] || ART.microbes)(s, P);
    return heading(s, sc.cap, P.acc) + (L.length ? at(540, 520, `<g transform="scale(.92)">${art}</g>`) + sideList(s, L) : at(800, 520, art));
  };

  /* ---------- the whole motion graphic as one SVG ---------- */
  // meta: {key, grade (name), n (chapter number), title, color}; opt: {only: index of the one scene to draw (poster), static: no animation}
  function svg(data, meta, opt) {
    opt = opt || {};
    const tl = timeline(data), acc = mix(meta.color || '#10b981', '#a7f3d0', 0.45);
    const bg = mix(meta.color || '#10b981', '#03130e', 0.82);
    const P = { acc, bg, soft: '#c9e8dc', grade: meta.grade, n: meta.n, title: meta.title, idea: data.idea };
    const rand = rng(meta.key || meta.title);
    let blobs = '';
    for (let i = 0; i < 7; i++) {
      blobs += `<g class="lb" style="--d:${r2(-rand() * 6)}s;--t:${r2(5 + rand() * 5)}s"><circle cx="${r2(rand() * W)}" cy="${r2(rand() * H)}" r="${r2(90 + rand() * 170)}" fill="url(#mgB${i % 3})"/></g>`;
    }
    let body = '';
    tl.scenes.forEach((x, i) => {
      if (opt.only != null && opt.only !== i) return;
      const inner = R[x.sc.type](x.sc, opt.only != null ? 0 : x.s, x.d, P);
      if (opt.only != null) body += `<g>${inner}</g>`;
      else body += `<g class="sc" style="--s:${r2(x.s)}s;--e:${r2(i === tl.scenes.length - 1 ? x.s + x.d + 30 : x.s + x.d - 0.7)}s">${inner}</g>`;
    });
    const dots = opt.only != null ? '' : tl.scenes.map((x, i) => {
      const cx = 800 + ((tl.scenes.length - 1) / 2 - i) * 26;
      return `<circle cx="${r2(cx)}" cy="872" r="6" fill="rgba(255,255,255,.22)"/><circle class="sc" style="--s:${r2(x.s)}s;--e:${r2(i === tl.scenes.length - 1 ? x.s + 99 : x.s + x.d)}s" cx="${r2(cx)}" cy="872" r="7" fill="${acc}"/>`;
    }).join('');
    const label = `${meta.title}: ${data.scenes.map((x) => x.cap || '').filter(Boolean).join('، ')}`;
    return `<svg class="mg${opt.static ? ' static' : ''}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">` +
      `<style>${CSS}</style><defs><linearGradient id="mgBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(bg, '#ffffff', 0.06)}"/><stop offset="1" stop-color="${mix(bg, '#000000', 0.35)}"/></linearGradient>` +
      [0, 1, 2].map((i) => `<radialGradient id="mgB${i}"><stop offset="0" stop-color="${[acc, '#7dd3fc', '#c4b5fd'][i]}" stop-opacity=".16"/><stop offset="1" stop-color="${[acc, '#7dd3fc', '#c4b5fd'][i]}" stop-opacity="0"/></radialGradient>`).join('') +
      `</defs><rect width="${W}" height="${H}" fill="url(#mgBg)"/>${blobs}` +
      (opt.only === 0 ? '' : T(100, 60, `${meta.grade}، ${meta.title}`, { size: 22, w: 600, fill: 'rgba(255,255,255,.55)', align: 'l' })) +
      body + dots + '</svg>';
  }

  /* ---------- validation (used by the build checks) ---------- */
  function validate(data) {
    const err = [];
    const need = { flow: ['steps'], cycle: ['steps'], hierarchy: ['levels'], compare: ['right', 'left'], cell: ['labels'], points: ['points'], summary: ['points'], organ: ['organ'], division: [], dna: [], punnett: [] };
    const range = { flow: ['steps', 2, 5], cycle: ['steps', 3, 6], hierarchy: ['levels', 2, 8], cell: ['labels', 2, 6], points: ['points', 2, 5], summary: ['points', 2, 5], dna: ['labels', 0, 3], organ: ['labels', 0, 5] };
    if (!data || !Array.isArray(data.scenes)) return ['scenes مفقودة'];
    if (data.scenes.length < 3 || data.scenes.length > 7) err.push(`عدد المشاهد ${data.scenes.length} (المسموح ٣–٧)`);
    if (!data.scenes.length || data.scenes[data.scenes.length - 1].type !== 'summary') err.push('آخر مشهد يجب أن يكون summary');
    data.scenes.forEach((sc, i) => {
      const at = `مشهد ${i + 1} (${sc.type})`;
      if (!need[sc.type]) return err.push(`${at}: نوع غير معروف`);
      if (sc.type !== 'summary' && !sc.cap) err.push(`${at}: cap مفقود`);
      need[sc.type].forEach((f) => { if (sc[f] == null) err.push(`${at}: ${f} مفقود`); });
      const rg = range[sc.type];
      if (rg && sc[rg[0]] && (sc[rg[0]].length < rg[1] || sc[rg[0]].length > rg[2])) err.push(`${at}: عدد ${rg[0]} ${sc[rg[0]].length} خارج ${rg[1]}–${rg[2]}`);
      if (sc.type === 'organ' && !ART[sc.organ]) err.push(`${at}: organ غير معروف ${sc.organ}`);
      if (sc.type === 'cell' && !CELL_AT[sc.variant]) err.push(`${at}: variant غير معروف ${sc.variant}`);
      if (sc.type === 'compare') ['right', 'left'].forEach((k) => { const v = sc[k]; if (!v || !v.title || !Array.isArray(v.points) || v.points.length < 1 || v.points.length > 4) err.push(`${at}: ${k} يحتاج title و١–٤ نقاط`); });
    });
    const t = timeline(data).total;
    if (t < 35 || t > 75) err.push(`المدة ${Math.round(t)}ث خارج ٣٥–٧٥ث`);
    return err;
  }

  /* ---------- music: a calm generated score (no words) ---------- */
  const ROOTS = { 1: 60, 2: 62, 3: 65, 4: 67, 5: 57, 6: 64 };
  const MAJ = [0, 2, 4, 5, 7, 9, 11];
  const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function score(meta, total, sceneStarts) {
    const rand = rng('music:' + meta.key), root = ROOTS[meta.gradeId] || 60, L = (60 / 70) * 4;
    const progs = [[0, 4, 5, 3], [0, 5, 3, 4], [5, 3, 0, 4], [0, 3, 5, 4]], prog = progs[Math.floor(rand() * progs.length)];
    const deg = (dg, oct) => root + 12 * (oct || 0) + MAJ[((dg % 7) + 7) % 7] + 12 * Math.floor(dg / 7);
    const notes = [];
    const bars = Math.ceil(total / L);
    for (let b = 0; b < bars; b++) {
      const t = b * L, dg = prog[b % 4];
      if (t > total - 1.5) break;
      [dg, dg + 2, dg + 4].forEach((x, i) => notes.push({ k: 'pad', t, d: L + 1.4, f: freq(deg(x, -1)), g: 0.05, p: (i - 1) * 0.35 }));
      notes.push({ k: 'bass', t, d: L * 0.9, f: freq(deg(dg, -2)), g: 0.085, p: 0 });
      if (b === 0) continue;
      const pent = [0, 1, 2, 4, 5].map((x) => x + dg);
      for (let e = 0; e < 8; e++) {
        if (rand() < (e % 2 ? 0.32 : 0.58)) notes.push({ k: 'pluck', t: t + (e * L) / 8, d: 1.6, f: freq(deg(pent[Math.floor(rand() * 5)], 1)), g: 0.038, p: rand() * 1.2 - 0.6 });
      }
    }
    (sceneStarts || []).slice(1).forEach((t) => notes.push({ k: 'bell', t: t + 0.15, d: 2.8, f: freq(deg(4, 2)), g: 0.03, p: 0.2 }));
    notes.push({ k: 'bell', t: Math.max(0, total - 3.2), d: 3.2, f: freq(deg(0, 2)), g: 0.035, p: -0.2 });
    return notes.sort((a, b) => a.t - b.t);
  }
  // a master chain (soft reverb + gentle compression) on an AudioContext or OfflineAudioContext
  function chain(ctx, total) {
    const master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    const rev = ctx.createConvolver(), len = Math.floor(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    const rnd = rng('ir');
    for (let c = 0; c < 2; c++) { const ch = ir.getChannelData(c); for (let i = 0; i < len; i++) ch[i] = (rnd() * 2 - 1) * Math.pow(1 - i / len, 3); }
    rev.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    const dry = ctx.createGain(); dry.gain.value = 1;
    dry.connect(master); dry.connect(rev); rev.connect(wet); wet.connect(master); master.connect(comp); comp.connect(ctx.destination);
    return { input: dry, master, total };
  }
  // play one note at context time `at`, lasting `dur` seconds (already scaled by speed)
  function voice(ctx, out, n, at, dur) {
    const g = ctx.createGain(), pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const end = at + dur;
    g.gain.setValueAtTime(0.0001, at);
    if (n.k === 'pad') { g.gain.linearRampToValueAtTime(n.g, at + Math.min(1.3, dur / 2)); g.gain.setValueAtTime(n.g, end - Math.min(1.4, dur / 2)); g.gain.linearRampToValueAtTime(0.0001, end); }
    else if (n.k === 'bass') { g.gain.linearRampToValueAtTime(n.g, at + 0.06); g.gain.exponentialRampToValueAtTime(n.g * 0.4, end - 0.05); g.gain.linearRampToValueAtTime(0.0001, end); }
    else { g.gain.linearRampToValueAtTime(n.g, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, end); }
    const types = n.k === 'pad' ? ['sine', 'triangle'] : n.k === 'bass' ? ['sine'] : n.k === 'bell' ? ['sine', 'sine'] : ['triangle'];
    let last = g;
    if (n.k === 'pad') { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1300; g.connect(lp); last = lp; }
    if (pan) { pan.pan.value = n.p; last.connect(pan); pan.connect(out); } else last.connect(out);
    types.forEach((ty, i) => {
      const o = ctx.createOscillator(); o.type = ty;
      o.frequency.value = n.k === 'bell' && i ? n.f * 2.76 : n.f; if (n.k === 'pad' && i) o.detune.value = 7;
      if (n.k === 'bell' && i) { const gg = ctx.createGain(); gg.gain.value = 0.3; o.connect(gg); gg.connect(g); } else o.connect(g);
      o.start(at); o.stop(end + 0.05);
    });
  }
  // render the whole score offline → AudioBuffer (used for the MP4 export)
  function renderAudio(meta, data, sampleRate) {
    const tl = timeline(data), total = tl.total, sr = sampleRate || 44100;
    const ctx = new OfflineAudioContext(2, Math.ceil(total * sr), sr), ch = chain(ctx, total);
    ch.master.gain.setValueAtTime(0, 0); ch.master.gain.linearRampToValueAtTime(0.9, 1.5);
    ch.master.gain.setValueAtTime(0.9, Math.max(1.6, total - 3)); ch.master.gain.linearRampToValueAtTime(0, total);
    score(meta, total, tl.scenes.map((x) => x.s)).forEach((n) => voice(ctx, ch.input, n, n.t, Math.min(n.d, total - n.t)));
    return ctx.startRendering();
  }

  const MG = { W, H, AR, CSS, timeline, svg, validate, score, chain, voice, renderAudio, SCENE_TYPES, ORGANS, CELLS: Object.keys(CELL_AT) };
  if (typeof module === 'object' && module && module.exports) module.exports = MG;
  if (root) root.MG = MG;   // the app's global; also what bundlers that wrap this file can read
})(typeof self !== 'undefined' ? self : this);
