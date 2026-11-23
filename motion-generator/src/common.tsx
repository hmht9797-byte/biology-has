import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT_BODY, FONT_HEAD, PALETTE } from './theme';

/** ظهور نابض بعد تأخير (بالإطارات) */
export function usePop(delay = 0, damping = 14) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 } });
}

export const fadeIn = (frame: number, start: number, len = 12) =>
  interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/** توزيع ظهور العناصر على مدة المشهد، فيظهر كل عنصر قرابة حين يذكره التعليق */
export function stagger(i: number, n: number, durationInFrames: number, from = 18) {
  const span = Math.max(durationInFrames * 0.62 - from, n * 8);
  return Math.round(from + (span * i) / Math.max(1, n));
}

/** خلفية زمردية بشبكة نقاط وخلايا عائمة بطيئة */
export const Background: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const blobs = [
    { x: 8, y: 18, r: 220, s: 0.9 },
    { x: 92, y: 80, r: 300, s: 0.6 },
    { x: 78, y: 12, r: 140, s: 1.2 },
    { x: 16, y: 86, r: 170, s: 0.8 },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 85% 0%, ${C.bg2} 0%, ${C.bg1} 62%)` }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="dots" width="44" height="44" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="rgba(167,243,208,0.10)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
        {blobs.map((b, i) => (
          <circle
            key={i}
            cx={`${b.x + Math.sin((frame / 90) * b.s + i) * 2}%`}
            cy={`${b.y + Math.cos((frame / 110) * b.s + i) * 2}%`}
            r={b.r}
            fill="none"
            stroke={i % 2 ? accent : C.mint}
            strokeOpacity={0.1}
            strokeWidth={3}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const Heading: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const p = usePop(0, 16);
  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        right: 96,
        left: 96,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        direction: 'rtl',
        opacity: p,
        transform: `translateY(${(1 - p) * -24}px)`,
      }}
    >
      <span style={{ width: 14, height: 58, borderRadius: 8, background: `linear-gradient(${accent}, ${C.gold})` }} />
      <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 62, color: C.ink, lineHeight: 1.25 }}>{text}</span>
    </div>
  );
};

/** شارة مرقّمة تربط الرسم بقائمة الأسماء */
export const Badge: React.FC<{ n: number; color: string; size?: number }> = ({ n, color, size = 46 }) => (
  <span
    style={{
      width: size,
      height: size,
      flex: 'none',
      borderRadius: '50%',
      background: color,
      color: C.bg1,
      display: 'grid',
      placeItems: 'center',
      fontFamily: FONT_HEAD,
      fontWeight: 800,
      fontSize: size * 0.5,
    }}
  >
    {'٠١٢٣٤٥٦٧٨٩'[n] ?? n}
  </span>
);

/** قائمة أسماء مرقّمة تظهر واحدًا بعد واحد بجانب الرسم */
export const LabelList: React.FC<{ labels: string[]; starts: number[]; width?: number }> = ({ labels, starts, width = 620 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width, direction: 'rtl' }}>
      {labels.map((l, i) => {
        const o = fadeIn(frame, starts[i]);
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              opacity: o,
              transform: `translateX(${(1 - o) * 40}px)`,
              background: C.panel,
              border: `1px solid ${C.panelLine}`,
              borderRadius: 20,
              padding: '12px 20px',
            }}
          >
            <Badge n={i + 1} color={PALETTE[i % PALETTE.length]} />
            <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.35 }}>{l}</span>
          </div>
        );
      })}
    </div>
  );
};

/** نقطة مرقّمة على الرسم تنبض حين تظهر */
export const Pin: React.FC<{ x: number; y: number; n: number; start: number }> = ({ x, y, n, start }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, start, 8);
  const pulse = 1 + Math.max(0, 1 - (frame - start) / 20) * 0.6;
  const color = PALETTE[(n - 1) % PALETTE.length];
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${pulse})`}>
      <circle r={26} fill={color} stroke={C.bg1} strokeWidth={4} />
      <text textAnchor="middle" dy={10} fontFamily={FONT_HEAD} fontWeight={800} fontSize={28} fill={C.bg1}>
        {'٠١٢٣٤٥٦٧٨٩'[n] ?? n}
      </text>
    </g>
  );
};

/** الترجمة النصية: تعرض الجملة الجارية وتبرز الكلمة المنطوقة الآن */
export const Captions: React.FC<{ words: { t: number; d: number; w: string }[]; offset: number }> = ({ words, offset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - offset;
  if (!words.length || t < 0) return null;
  // مقاطع من نحو ٩ كلمات، تنكسر عند علامات الوقف
  const chunks: (typeof words)[] = [];
  let cur: typeof words = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 9 || /[.،؛:؟!]$/.test(w.w)) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  const idx = chunks.findIndex((c, i) => t < (chunks[i + 1]?.[0].t ?? Infinity));
  const chunk = chunks[Math.max(0, idx)];
  const last = chunk[chunk.length - 1];
  if (t > last.t + last.d + 1.2) return null;
  return (
    <div style={{ position: 'absolute', bottom: 46, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          direction: 'rtl',
          maxWidth: 1600,
          padding: '14px 34px',
          borderRadius: 22,
          background: 'rgba(2,44,34,0.82)',
          border: `1px solid ${C.panelLine}`,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.5,
          textAlign: 'center',
        }}
      >
        {chunk.map((w, i) => (
          <span key={i} style={{ color: t >= w.t ? C.ink : 'rgba(236,253,245,0.45)' }}>
            {w.w}
            {i < chunk.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};
