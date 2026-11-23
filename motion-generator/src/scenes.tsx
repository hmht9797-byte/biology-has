import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Draw, ORGANS } from './art';
import { Badge, fadeIn, Heading, LabelList, Pin, stagger, usePop } from './common';
import { C, FONT_BODY, FONT_HEAD, PALETTE } from './theme';
import type { Scene } from './types';

const AR = (s: string | number) => String(s).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
type P<T extends Scene['type']> = { scene: Extract<Scene, { type: T }>; dur: number; accent: string; meta: { grade: string; n: number; title: string; en?: string } };

/** لوحة المحتوى: الرسم يسارًا والأسماء يمينًا (اتجاه القراءة العربي) */
const Stage: React.FC<{ art: React.ReactNode; side?: React.ReactNode }> = ({ art, side }) => (
  <>
    <div style={{ position: 'absolute', left: 110, top: 175, width: 860, height: 740, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{art}</div>
    <div style={{ position: 'absolute', right: 110, top: 175, width: 760, height: 740, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{side}</div>
  </>
);

const Card: React.FC<{ children: React.ReactNode; o: number; style?: React.CSSProperties }> = ({ children, o, style }) => (
  <div style={{ opacity: o, transform: `translateY(${(1 - o) * 30}px)`, background: C.panel, border: `1px solid ${C.panelLine}`, borderRadius: 28, direction: 'rtl', ...style }}>{children}</div>
);

export const TitleScene: React.FC<P<'title'>> = ({ accent, meta }) => {
  const frame = useCurrentFrame();
  const p = usePop(4, 12);
  const q = usePop(16, 14);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 22 }).map((_, i) => {
          const y = 120 + i * 40;
          const ph = frame / 14 + i * 0.5;
          return (
            <g key={i} opacity={0.35}>
              <circle cx={1560 + Math.sin(ph) * 90} cy={y} r={9} fill={C.mint} />
              <circle cx={1560 - Math.sin(ph) * 90} cy={y} r={9} fill={C.gold} />
              <line x1={1560 + Math.sin(ph) * 90} x2={1560 - Math.sin(ph) * 90} y1={y} y2={y} stroke="rgba(236,253,245,0.25)" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      <div style={{ transform: `scale(${0.8 + p * 0.2})`, opacity: p, textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 44, color: C.inkSoft }}>علم الأحياء، الصف {meta.grade}</div>
        <div style={{ display: 'inline-grid', placeItems: 'center', width: 150, height: 150, borderRadius: 40, margin: '34px 0 24px', background: accent, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 92, color: '#fff' }}>{AR(meta.n)}</div>
        <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 112, color: C.ink, lineHeight: 1.2 }}>{meta.title}</div>
        {meta.en && <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 46, color: C.gold, direction: 'ltr', marginTop: 10, opacity: q }}>{meta.en}</div>}
        <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 38, color: C.inkSoft, marginTop: 34, opacity: q }}>ملخص الفصل بالموشن غرافيك</div>
      </div>
    </AbsoluteFill>
  );
};

export const DefinitionScene: React.FC<P<'definition'>> = ({ scene, accent }) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, 10, 16);
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 200, bottom: 170, alignItems: 'center', justifyContent: 'center', padding: '0 180px' }}>
        <Card o={o} style={{ padding: '60px 80px', borderRight: `14px solid ${C.gold}` }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 58, lineHeight: 1.75, color: C.ink }}>{scene.text}</div>
        </Card>
      </AbsoluteFill>
    </>
  );
};

export const TimelineScene: React.FC<P<'timeline'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const n = scene.items.length;
  const line = interpolate(frame, [8, dur * 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 200, bottom: 170, direction: 'rtl', justifyContent: 'center', padding: '0 120px' }}>
        <div style={{ position: 'relative', height: 520 }}>
          <div style={{ position: 'absolute', top: 250, right: 0, height: 8, width: `${line * 100}%`, borderRadius: 4, background: `linear-gradient(270deg, ${C.mint}, ${C.gold})` }} />
          {scene.items.map((it, i) => {
            const st = stagger(i, n, dur, 12);
            const o = fadeIn(frame, st, 14);
            const up = i % 2 === 0;
            const x = (i + 0.5) * (100 / n);
            return (
              <div key={i} style={{ position: 'absolute', right: `${x}%`, transform: 'translateX(50%)', top: up ? 30 : 290, width: 1680 / n - 20, opacity: o, textAlign: 'center' }}>
                <div style={{ order: up ? 0 : 1 }}>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 52, color: PALETTE[i % PALETTE.length] }}>{it.year}</div>
                  <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 34, color: C.ink, lineHeight: 1.4, marginTop: 8 }}>{it.label}</div>
                </div>
                <div style={{ position: 'absolute', right: '50%', transform: 'translateX(50%)', top: up ? 200 : -60, width: 34, height: 34, borderRadius: '50%', background: PALETTE[i % PALETTE.length], border: `6px solid ${C.bg1}` }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

export const HierarchyScene: React.FC<P<'hierarchy'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const n = scene.levels.length;
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 180, bottom: 160, alignItems: 'center', justifyContent: 'center', direction: 'rtl', gap: 10 }}>
        {scene.levels.map((l, i) => {
          const o = fadeIn(frame, stagger(i, n, dur, 10), 12);
          const w = 1300 - (i * 760) / Math.max(1, n - 1);
          return (
            <div key={i} style={{ opacity: o, transform: `scaleX(${0.6 + o * 0.4})`, width: w, height: Math.min(96, 520 / n), minHeight: 56, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, background: PALETTE[i % PALETTE.length], color: C.bg1, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: Math.min(46, 360 / n + 8) }}>
              <span style={{ opacity: 0.6 }}>{AR(i + 1)}</span>
              {l}
            </div>
          );
        })}
        {scene.note && <div style={{ marginTop: 14, opacity: fadeIn(frame, dur * 0.7), fontFamily: FONT_BODY, fontWeight: 700, fontSize: 36, color: C.gold }}>{scene.note}</div>}
      </AbsoluteFill>
    </>
  );
};

const CellArt: React.FC<{ variant: 'animal' | 'plant' | 'bacteria'; labels: string[]; starts: number[] }> = ({ variant, labels, starts }) => {
  const frame = useCurrentFrame();
  const wob = Math.sin(frame / 20) * 4;
  const pins: [number, number][] =
    variant === 'bacteria'
      ? [[400, 200], [320, 360], [520, 360], [170, 360], [650, 360], [400, 520]]
      : [[400, 120], [400, 330], [560, 470], [250, 470], [300, 220], [560, 230]];
  return (
    <svg viewBox="0 0 800 700" width={820} height={720}>
      {variant === 'bacteria' ? (
        <>
          <Draw start={0} stroke={C.ink} strokeWidth={8} fill="#a7f3d0" d="M220 230 L580 230 A130 130 0 0 1 580 490 L220 490 A130 130 0 0 1 220 230 Z" />
          <Draw start={14} stroke="#047857" strokeWidth={5} fill="none" d="M260 330 C300 300 340 400 380 350 C420 300 460 400 500 340 C530 300 540 380 520 400" />
          {[[480, 420], [300, 430], [430, 290]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill="#065f46" opacity={fadeIn(frame, 20 + i * 4)} />)}
          <Draw start={24} stroke={C.ink} strokeWidth={4} fill="none" d={`M90 360 C${60 + wob} 320 ${30 - wob} 400 0 360`} />
        </>
      ) : (
        <>
          {variant === 'plant' ? (
            <>
              <Draw start={0} stroke="#166534" strokeWidth={14} fill="#bbf7d0" d="M110 90 L690 90 L690 610 L110 610 Z" />
              <Draw start={8} stroke={C.ink} strokeWidth={4} fill="#ecfdf5" d="M130 110 L670 110 L670 590 L130 590 Z" />
              <Draw start={16} stroke="#0369a1" strokeWidth={4} fill="#bae6fd" d="M300 300 L540 300 L540 540 L300 540 Z" />
              {[[200, 200], [600, 180], [200, 520], [620, 560]].map(([x, y], i) => (
                <Draw key={i} start={22 + i * 3} stroke="#14532d" strokeWidth={3} fill="#22c55e" d={`M${x - 40} ${y} a40 22 0 1 0 80 0 a40 22 0 1 0 -80 0`} />
              ))}
            </>
          ) : (
            <Draw start={0} stroke={C.ink} strokeWidth={8} fill="#bbf7d0" d={`M400 ${100 + wob} C580 ${100 - wob} 700 220 690 360 C680 520 560 ${610 + wob} 400 610 C230 ${610 - wob} 110 510 110 350 C110 200 230 100 400 ${100 + wob} Z`} />
          )}
          <Draw start={12} stroke="#6d28d9" strokeWidth={5} fill="#c4b5fd" d="M400 260 a75 70 0 1 0 0.1 0" />
          <Draw start={18} stroke="none" fill="#6d28d9" d="M420 320 a22 22 0 1 0 0.1 0" />
          <Draw start={22} stroke="#b45309" strokeWidth={4} fill="#fdba74" d="M520 450 c40 -30 100 -10 90 30 c-10 40 -80 50 -100 20 c-8 -12 -5 -36 10 -50 Z M535 470 c20 10 40 0 60 10" />
          <Draw start={26} stroke="#be185d" strokeWidth={4} fill="none" d="M200 440 c30 -20 60 20 90 0 M205 470 c30 -20 60 20 90 0 M210 500 c30 -20 60 20 90 0" />
          <Draw start={30} stroke="#0e7490" strokeWidth={4} fill="none" d="M260 200 c40 0 40 30 80 30 M250 230 c40 0 40 30 80 30" />
          {[[580, 250], [610, 300], [250, 360], [470, 560]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#0f766e" opacity={fadeIn(frame, 30 + i * 3)} />)}
        </>
      )}
      {labels.map((_, i) => pins[i] && <Pin key={i} x={pins[i][0]} y={pins[i][1]} n={i + 1} start={starts[i]} />)}
    </svg>
  );
};

export const CellScene: React.FC<P<'cell'>> = ({ scene, dur, accent }) => {
  const starts = scene.labels.map((_, i) => stagger(i, scene.labels.length, dur, 30));
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <Stage art={<CellArt variant={scene.variant} labels={scene.labels} starts={starts} />} side={<LabelList labels={scene.labels} starts={starts} />} />
    </>
  );
};

export const OrganScene: React.FC<P<'organ'>> = ({ scene, dur, accent }) => {
  const art = ORGANS[scene.organ];
  const starts = scene.labels.map((_, i) => stagger(i, scene.labels.length, dur, 40));
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <Stage
        art={
          <svg viewBox="0 0 800 700" width={820} height={720}>
            {art.draw(0)}
            {scene.labels.map((_, i) => art.pins[i] && <Pin key={i} x={art.pins[i][0]} y={art.pins[i][1]} n={i + 1} start={starts[i]} />)}
          </svg>
        }
        side={<LabelList labels={scene.labels} starts={starts} />}
      />
    </>
  );
};

/** نسيج: خلايا متجاورة تتكاثر لتملأ الشكل */
export const TissueScene: React.FC<P<'tissue'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const starts = scene.labels.map((_, i) => stagger(i, scene.labels.length, dur, 30));
  const cells = Array.from({ length: 48 }, (_, i) => ({ c: i % 8, r: Math.floor(i / 8) }));
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <Stage
        art={
          <svg viewBox="0 0 800 700" width={820} height={720}>
            {cells.map(({ c, r }, i) => {
              const o = fadeIn(frame, i * 0.9, 10);
              const x = 80 + c * 85 + (r % 2) * 42;
              const y = 120 + r * 85;
              return (
                <g key={i} opacity={o} transform={`translate(${x} ${y}) scale(${0.6 + o * 0.4})`}>
                  <path d="M0 -44 L38 -22 L38 22 L0 44 L-38 22 L-38 -22 Z" fill="#a7f3d0" stroke="#065f46" strokeWidth={3} />
                  <circle r={13} fill="#7c3aed" opacity={0.85} />
                </g>
              );
            })}
            {scene.labels.map((_, i) => <Pin key={i} x={160 + (i % 3) * 230} y={200 + Math.floor(i / 3) * 260} n={i + 1} start={starts[i]} />)}
          </svg>
        }
        side={<LabelList labels={scene.labels} starts={starts} />}
      />
    </>
  );
};

export const CompareScene: React.FC<P<'compare'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const cols = [
    { ...scene.right, color: C.mint },
    { ...scene.left, color: C.gold },
  ];
  const total = scene.left.points.length + scene.right.points.length;
  let k = 0;
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 190, bottom: 160, padding: '0 110px', display: 'flex', flexDirection: 'row', direction: 'rtl', gap: 50, alignItems: 'center' }}>
        {cols.map((col, ci) => (
          <Card key={ci} o={fadeIn(frame, 6 + ci * 8)} style={{ flex: 1, padding: '34px 44px', borderTop: `12px solid ${col.color}` }}>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 50, color: col.color, marginBottom: 22 }}>{col.title}</div>
            {col.points.map((pt, i) => {
              const o = fadeIn(frame, stagger(k++, total, dur, 20));
              return (
                <div key={i} style={{ opacity: o, display: 'flex', gap: 16, alignItems: 'baseline', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.55, marginBottom: 14 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: col.color, flex: 'none', transform: 'rotate(45deg)' }} />
                  {pt}
                </div>
              );
            })}
          </Card>
        ))}
      </AbsoluteFill>
    </>
  );
};

export const ProcessScene: React.FC<P<'process'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const n = scene.steps.length;
  const perRow = n > 4 ? Math.ceil(n / 2) : n;
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 200, bottom: 170, padding: '0 90px', direction: 'rtl', display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', rowGap: 50 }}>
        {scene.steps.map((st, i) => {
          const o = fadeIn(frame, stagger(i, n, dur, 12));
          const flow = (frame / 6) % 1;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', width: `${100 / perRow}%`, opacity: o }}>
              <Card o={1} style={{ flex: 1, padding: '28px 26px', textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <Badge n={i + 1} color={PALETTE[i % PALETTE.length]} size={60} />
                <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 36, color: C.ink, lineHeight: 1.45 }}>{st}</div>
              </Card>
              {i < n - 1 && (i + 1) % perRow !== 0 && (
                <svg width={70} height={40} style={{ flex: 'none' }}>
                  <path d="M66 20 L8 20 M24 6 L8 20 L24 34" stroke={C.gold} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="10 8" strokeDashoffset={flow * 18} />
                </svg>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </>
  );
};

export const CycleScene: React.FC<P<'cycle'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const n = scene.steps.length;
  const R = 300;
  const spin = frame * 0.6;
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 170, bottom: 140, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 1100, height: 760 }}>
          <svg width={1100} height={760} style={{ position: 'absolute' }}>
            <circle cx={550} cy={380} r={R} fill="none" stroke={C.panelLine} strokeWidth={10} />
            <circle cx={550} cy={380} r={R} fill="none" stroke={C.gold} strokeWidth={10} strokeDasharray="40 1840" transform={`rotate(${spin} 550 380)`} strokeLinecap="round" />
          </svg>
          {scene.steps.map((st, i) => {
            const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
            const o = fadeIn(frame, stagger(i, n, dur, 10));
            return (
              <div key={i} style={{ position: 'absolute', left: 550 + Math.cos(a) * R - 160, top: 380 + Math.sin(a) * R - 60, width: 320, opacity: o, transform: `scale(${0.7 + o * 0.3})` }}>
                <Card o={1} style={{ padding: '18px 20px', textAlign: 'center', borderTop: `8px solid ${PALETTE[i % PALETTE.length]}` }}>
                  <div style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 32, color: C.ink, lineHeight: 1.4 }}>{st}</div>
                </Card>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </>
  );
};

/** انقسام الخلية: خلية واحدة تتطاول وتنقسم إلى اثنتين بينما تظهر أسماء الأطوار */
export const DivisionScene: React.FC<P<'division'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [20, dur * 0.75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const split = interpolate(k, [0.55, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const stretch = interpolate(k, [0.25, 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const n = scene.phases.length;
  const starts = scene.phases.map((_, i) => stagger(i, n, dur, 20));
  const chromo = (cx: number, cy: number, sep: number) =>
    [-40, -12, 16, 44].map((dy, i) => (
      <g key={i}>
        <path d={`M${cx - 18 - sep} ${cy + dy - 14} L${cx - 6 - sep} ${cy + dy + 14}`} stroke="#7c3aed" strokeWidth={9} strokeLinecap="round" />
        <path d={`M${cx + 18 + sep} ${cy + dy - 14} L${cx + 6 + sep} ${cy + dy + 14}`} stroke="#db2777" strokeWidth={9} strokeLinecap="round" />
      </g>
    ));
  const w = 170 + stretch * 90;
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <Stage
        art={
          <svg viewBox="0 0 800 700" width={820} height={720}>
            {split < 0.02 ? (
              <>
                <ellipse cx={400} cy={350} rx={w} ry={170 - stretch * 20} fill="#bbf7d0" stroke={C.ink} strokeWidth={7} />
                {stretch > 0.05 && <path d={`M${400 - w + 20} 350 L${400 + w - 20} 350`} stroke={C.gold} strokeWidth={2} strokeDasharray="6 6" />}
                {chromo(400, 350, stretch * 120)}
              </>
            ) : (
              [-1, 1].map((sd) => (
                <g key={sd} transform={`translate(${sd * split * 120} 0)`}>
                  <ellipse cx={400 + sd * 130} cy={350} rx={140} ry={150} fill="#bbf7d0" stroke={C.ink} strokeWidth={7} />
                  <circle cx={400 + sd * 130} cy={350} r={60} fill="#c4b5fd" stroke="#6d28d9" strokeWidth={4} />
                </g>
              ))
            )}
          </svg>
        }
        side={<LabelList labels={scene.phases} starts={starts} width={600} />}
      />
    </>
  );
};

export const DnaScene: React.FC<P<'dna'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const starts = scene.labels.map((_, i) => stagger(i, scene.labels.length, dur, 30));
  const pairs = ['#f87171', '#60a5fa', '#fbbf24', '#34d399'];
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <Stage
        art={
          <svg viewBox="0 0 800 700" width={820} height={720}>
            {Array.from({ length: 18 }).map((_, i) => {
              const y = 40 + i * 36;
              const ph = frame / 12 + i * 0.55;
              const x1 = 400 + Math.sin(ph) * 170;
              const x2 = 400 - Math.sin(ph) * 170;
              const o = fadeIn(frame, i * 1.5, 10);
              return (
                <g key={i} opacity={o}>
                  <line x1={x1} x2={(x1 + x2) / 2} y1={y} y2={y} stroke={pairs[i % 4]} strokeWidth={10} />
                  <line x1={(x1 + x2) / 2} x2={x2} y1={y} y2={y} stroke={pairs[(i + 2) % 4]} strokeWidth={10} />
                  <circle cx={x1} cy={y} r={13} fill={C.mint} />
                  <circle cx={x2} cy={y} r={13} fill={C.gold} />
                </g>
              );
            })}
            {scene.labels.map((_, i) => <Pin key={i} x={i % 2 ? 640 : 160} y={130 + i * 110} n={i + 1} start={starts[i]} />)}
          </svg>
        }
        side={<LabelList labels={scene.labels} starts={starts} />}
      />
    </>
  );
};

export const ListScene: React.FC<P<'list'>> = ({ scene, dur, accent }) => {
  const frame = useCurrentFrame();
  const n = scene.points.length;
  return (
    <>
      <Heading text={scene.heading} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 200, bottom: 170, padding: '0 150px', direction: 'rtl', justifyContent: 'center', gap: 22 }}>
        {scene.points.map((pt, i) => {
          const o = fadeIn(frame, stagger(i, n, dur, 12));
          return (
            <Card key={i} o={o} style={{ padding: '20px 32px', display: 'flex', gap: 24, alignItems: 'center' }}>
              <Badge n={i + 1} color={PALETTE[i % PALETTE.length]} size={56} />
              <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 42, color: C.ink, lineHeight: 1.45 }}>{pt}</span>
            </Card>
          );
        })}
      </AbsoluteFill>
    </>
  );
};

export const SummaryScene: React.FC<P<'summary'>> = ({ scene, dur, accent, meta }) => {
  const frame = useCurrentFrame();
  const n = scene.points.length;
  return (
    <>
      <Heading text={`خلاصة الفصل: ${meta.title}`} accent={accent} />
      <AbsoluteFill style={{ height: 'auto', top: 200, bottom: 170, padding: '0 130px', direction: 'rtl', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, alignContent: 'center' }}>
        {scene.points.map((pt, i) => {
          const o = fadeIn(frame, stagger(i, n, dur, 10));
          return (
            <Card key={i} o={o} style={{ padding: '24px 30px', borderRight: `10px solid ${PALETTE[i % PALETTE.length]}` }}>
              <span style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.5 }}>{pt}</span>
            </Card>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 76, left: 96, opacity: fadeIn(frame, dur - 60), fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 30, color: C.gold }}>ملازم الأحياء التفاعلية</div>
    </>
  );
};

export const SCENES: Record<Scene['type'], React.FC<any>> = {
  title: TitleScene,
  definition: DefinitionScene,
  timeline: TimelineScene,
  hierarchy: HierarchyScene,
  cell: CellScene,
  organ: OrganScene,
  tissue: TissueScene,
  compare: CompareScene,
  process: ProcessScene,
  cycle: CycleScene,
  division: DivisionScene,
  dna: DnaScene,
  list: ListScene,
  summary: SummaryScene,
};
