import { continueRender, delayRender, staticFile } from 'remotion';

/** ألوان علمية هادئة من هوية «ملازم الأحياء التفاعلية»: زمرد اليخضور وذهب الإنجاز */
export const C = {
  bg1: '#022c22',
  bg2: '#064e3b',
  panel: 'rgba(236,253,245,0.07)',
  panelLine: 'rgba(167,243,208,0.22)',
  ink: '#ecfdf5',
  inkSoft: '#a7f3d0',
  gold: '#e6c36a',
  goldDeep: '#b8860b',
  mint: '#34d399',
  teal: '#2dd4bf',
  sky: '#7dd3fc',
  rose: '#fda4af',
  violet: '#c4b5fd',
  amber: '#fcd34d',
  cyto: '#bbf7d0',
};

export const PALETTE = [C.mint, C.sky, C.amber, C.rose, C.violet, C.teal, '#f0abfc', '#fdba74'];

export const FONT_HEAD = 'Cairo, sans-serif';
export const FONT_BODY = 'Tajawal, sans-serif';

const FACES: [string, string, string][] = [
  ['Cairo', '700', 'fonts/cairo-700.ttf'],
  ['Cairo', '800', 'fonts/cairo-800.ttf'],
  ['Tajawal', '400', 'fonts/tajawal-400.ttf'],
  ['Tajawal', '700', 'fonts/tajawal-700.ttf'],
];

let loaded = false;
/** يحمّل الخطوط المحلية قبل أول إطار، فلا يُرسم أي إطار بخط بديل */
export function loadFonts() {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('fonts');
  Promise.all(
    FACES.map(([family, weight, file]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
      return f.load();
    }),
  ).then(() => continueRender(handle), () => continueRender(handle));
}

export const FPS = 30;
export const LEAD_IN = 0.5; // ثوانٍ قبل بدء الكلام في كل مشهد
export const TAIL = 0.7; // ثوانٍ بعده
