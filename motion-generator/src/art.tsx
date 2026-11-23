import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C } from './theme';
import type { Organ } from './types';

/** مسار يُرسم تدريجيًا (رسم الخط) ثم تظهر تعبئته */
export const Draw: React.FC<React.SVGProps<SVGPathElement> & { start?: number; len?: number }> = ({ start = 0, len = 40, fill, ...p }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const f = interpolate(frame, [start + len * 0.6, start + len * 1.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <path
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - k}
      fill={fill}
      fillOpacity={fill && fill !== 'none' ? f : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    />
  );
};

type Art = { draw: (start: number) => React.ReactNode; pins: [number, number][] };
const S = { stroke: C.ink, strokeWidth: 5 } as const;

/** رسوم الأعضاء والتراكيب (لوحة 800×700) ومواضع النقاط المرقّمة على كل جزء */
export const ORGANS: Record<Organ, Art> = {
  heart: {
    pins: [[330, 110], [250, 300], [520, 290], [300, 470], [480, 490], [400, 640]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#fb7185" d="M400 640 C260 560 160 470 170 340 C178 245 260 200 330 215 C365 222 388 240 400 262 C412 240 438 222 472 215 C545 200 625 248 630 345 C638 470 540 560 400 640 Z" />
        <Draw start={s + 10} {...S} fill="#f43f5e" d="M300 225 C300 150 350 90 430 90 L470 90 C480 90 485 100 480 110 C470 125 430 128 420 150 L410 230" />
        <Draw start={s + 18} {...S} fill="#60a5fa" d="M250 230 L250 120 C250 95 280 95 285 118 L290 230" />
        <Draw start={s + 26} stroke={C.bg1} strokeWidth={6} fill="none" d="M400 270 C380 360 395 470 400 600" />
        <Draw start={s + 30} stroke={C.bg1} strokeWidth={5} fill="none" d="M200 380 C280 400 520 400 600 380" />
      </>
    ),
  },
  lungs: {
    pins: [[400, 100], [400, 290], [230, 420], [570, 420], [600, 560], [400, 655]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#93c5fd" d="M385 60 L415 60 L415 270 L385 270 Z" />
        <Draw start={s + 8} {...S} fill="none" d="M400 270 L320 330 L280 400 M400 270 L480 330 L520 400 M320 330 L250 360 M480 330 L550 360" />
        <Draw start={s + 14} {...S} fill="#fda4af" d="M360 250 C300 240 210 290 180 400 C160 480 170 580 230 610 C290 630 350 600 365 540 L370 300 Z" />
        <Draw start={s + 20} {...S} fill="#fda4af" d="M440 250 C500 240 590 290 620 400 C640 480 630 580 570 610 C510 630 450 600 435 540 L430 300 Z" />
        <Draw start={s + 34} stroke="#be123c" strokeWidth={3} fill="#fecdd3" d="M585 545 a16 16 0 1 0 0.1 0 M612 565 a13 13 0 1 0 0.1 0 M590 580 a12 12 0 1 0 0.1 0" />
        <Draw start={s + 40} {...S} fill="none" d="M150 655 C280 610 520 610 650 655" />
      </>
    ),
  },
  neuron: {
    pins: [[230, 330], [230, 330], [120, 200], [470, 360], [610, 360], [720, 340]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#c4b5fd" d="M230 270 C285 270 300 320 290 350 C280 395 230 410 195 390 C160 370 150 320 170 295 C185 278 205 270 230 270 Z" />
        <Draw start={s + 8} stroke={C.bg1} strokeWidth={4} fill="#7c3aed" d="M230 315 a22 22 0 1 0 0.1 0" />
        <Draw start={s + 12} {...S} fill="none" d="M180 290 L120 200 L80 170 M120 200 L100 140 M170 370 L100 450 L60 470 M100 450 L90 520 M250 270 L270 180 L250 120 M270 180 L320 140" />
        <Draw start={s + 22} {...S} fill="none" d="M290 340 L720 340" />
        {[0, 1, 2, 3].map((i) => (
          <Draw key={i} start={s + 28 + i * 4} stroke={C.ink} strokeWidth={4} fill="#fde68a" d={`M${360 + i * 85} 320 h60 a20 20 0 0 1 0 40 h-60 a20 20 0 0 1 0 -40 Z`} />
        ))}
        <Draw start={s + 46} {...S} fill="none" d="M720 340 L760 290 M720 340 L775 340 M720 340 L760 395" />
      </>
    ),
  },
  leaf: {
    pins: [[400, 160], [400, 380], [520, 330], [270, 470], [400, 630], [560, 520]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#4ade80" d="M400 60 C560 140 640 300 600 450 C570 560 480 610 400 620 C320 610 230 560 200 450 C160 300 240 140 400 60 Z" />
        <Draw start={s + 14} stroke="#14532d" strokeWidth={6} fill="none" d="M400 70 L400 680" />
        <Draw start={s + 22} stroke="#14532d" strokeWidth={4} fill="none" d="M400 220 L520 160 M400 300 L560 250 M400 380 L580 340 M400 460 L560 440 M400 220 L280 160 M400 300 L240 250 M400 380 L220 340 M400 460 L240 440" />
        <Draw start={s + 34} stroke="#14532d" strokeWidth={3} fill="#bbf7d0" d="M545 505 c12 -14 32 -14 44 0 c-12 14 -32 14 -44 0 Z" />
      </>
    ),
  },
  eye: {
    pins: [[400, 140], [300, 350], [330, 350], [400, 350], [610, 470], [730, 360]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#f8fafc" d="M400 110 a240 240 0 1 0 0.1 0" />
        <Draw start={s + 10} stroke="#f43f5e" strokeWidth={4} fill="none" d="M560 170 C620 240 640 300 640 350 C640 410 620 470 560 530" />
        <Draw start={s + 16} stroke={C.ink} strokeWidth={4} fill="#38bdf8" d="M290 280 C330 300 330 400 290 420 C260 400 260 300 290 280 Z" />
        <Draw start={s + 22} stroke={C.ink} strokeWidth={4} fill="#a5f3fc" d="M330 300 C380 300 380 400 330 400 C310 380 310 320 330 300 Z" />
        <Draw start={s + 26} stroke="none" fill="#0f172a" d="M300 330 a18 22 0 1 0 0.1 0" />
        <Draw start={s + 32} stroke={C.ink} strokeWidth={5} fill="#fbbf24" d="M630 330 L760 320 L760 380 L630 370 Z" />
      </>
    ),
  },
  kidney: {
    pins: [[230, 260], [330, 360], [430, 360], [470, 520], [300, 560], [560, 300]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#b45309" d="M330 90 C180 90 120 230 140 360 C160 520 260 630 380 600 C450 580 470 520 440 470 C410 430 420 300 450 250 C490 180 450 90 330 90 Z" />
        <Draw start={s + 12} stroke={C.ink} strokeWidth={3} fill="#f59e0b" d="M330 150 C230 160 200 260 210 360 C220 470 290 540 360 530 C390 520 380 470 370 430 C350 330 360 250 390 210 C410 180 380 150 330 150 Z" />
        <Draw start={s + 20} stroke={C.ink} strokeWidth={4} fill="#fde68a" d="M380 300 C430 300 450 340 445 380 C440 420 410 440 380 430 Z" />
        <Draw start={s + 28} stroke={C.ink} strokeWidth={10} fill="none" d="M445 400 C500 460 470 560 480 680" />
        <Draw start={s + 34} stroke="#ef4444" strokeWidth={10} fill="none" d="M440 320 L600 300 L760 300" />
      </>
    ),
  },
  flower: {
    pins: [[400, 200], [400, 340], [330, 300], [470, 300], [290, 430], [400, 600]],
    draw: (s) => (
      <>
        <Draw start={s} stroke="#166534" strokeWidth={10} fill="none" d="M400 360 L400 680" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <Draw key={a} start={s + 6 + i * 3} stroke={C.ink} strokeWidth={4} fill="#f9a8d4" transform={`rotate(${a} 400 270)`} d="M400 270 C350 200 360 120 400 100 C440 120 450 200 400 270 Z" />
        ))}
        <Draw start={s + 26} stroke={C.ink} strokeWidth={4} fill="#86efac" d="M330 380 C360 330 440 330 470 380 C430 400 370 400 330 380 Z" />
        <Draw start={s + 30} stroke={C.ink} strokeWidth={4} fill="#fde047" d="M380 330 L390 220 L410 220 L420 330 Z M400 220 a14 14 0 1 0 0.1 0" />
        <Draw start={s + 36} stroke={C.ink} strokeWidth={3} fill="none" d="M360 320 L320 250 M440 320 L480 250" />
        <Draw start={s + 40} stroke="#166534" strokeWidth={5} fill="#4ade80" d="M400 520 C330 490 280 440 270 420 C330 420 380 460 400 520 Z" />
      </>
    ),
  },
  microscope: {
    pins: [[470, 90], [450, 250], [380, 400], [360, 470], [330, 590], [520, 520]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#94a3b8" d="M440 60 L500 60 L500 120 L440 120 Z" />
        <Draw start={s + 6} {...S} fill="#cbd5e1" d="M430 120 L510 120 L470 360 L400 360 Z" />
        <Draw start={s + 14} {...S} fill="#64748b" d="M380 360 L430 360 L420 420 L390 420 Z" />
        <Draw start={s + 20} {...S} fill="#e2e8f0" d="M250 440 L520 440 L520 470 L250 470 Z" />
        <Draw start={s + 26} {...S} fill="none" d="M560 120 C640 240 640 460 560 560" />
        <Draw start={s + 32} {...S} fill="#94a3b8" d="M230 600 L600 600 L620 660 L210 660 Z" />
        <Draw start={s + 36} {...S} fill="#fde68a" d="M330 560 a40 18 0 1 0 0.1 0" />
      </>
    ),
  },
  bone: {
    pins: [[400, 130], [400, 360], [400, 360], [400, 600], [470, 250], [330, 470]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#fef3c7" d="M330 80 a60 60 0 0 1 140 0 a60 60 0 0 1 -20 110 L440 540 a60 60 0 0 1 20 110 a60 60 0 0 1 -140 0 a60 60 0 0 1 20 -110 L350 190 a60 60 0 0 1 -20 -110 Z" />
        <Draw start={s + 14} stroke="#b45309" strokeWidth={4} fill="#fca5a5" d="M375 200 L425 200 L420 530 L380 530 Z" />
        <Draw start={s + 22} stroke="#b45309" strokeWidth={3} fill="none" strokeDasharray="6 8" d="M330 120 C380 160 420 160 470 120 M330 620 C380 580 420 580 470 620" />
      </>
    ),
  },
  stomach: {
    pins: [[330, 80], [360, 220], [470, 320], [560, 460], [420, 560], [300, 560]],
    draw: (s) => (
      <>
        <Draw start={s} {...S} fill="#fca5a5" d="M310 60 L350 60 L360 200" />
        <Draw start={s + 8} {...S} fill="#fda4af" d="M350 190 C430 160 560 200 600 330 C640 460 580 570 470 590 C380 605 330 560 300 560 C260 560 250 600 220 600 L220 540 C270 540 300 500 330 500 C420 500 480 450 470 360 C460 280 400 250 360 250 Z" />
        <Draw start={s + 20} stroke="#be123c" strokeWidth={3} fill="none" d="M400 230 C480 250 540 330 530 420 M380 280 C440 300 490 360 480 430" />
      </>
    ),
  },
};
