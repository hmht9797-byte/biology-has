import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, type CalculateMetadataFunction } from 'remotion';
import { Background, Captions } from './common';
import { SCENES } from './scenes';
import { FPS, LEAD_IN, loadFonts, TAIL } from './theme';
import type { ChapterProps } from './types';

loadFonts();

/** مدة كل مشهد بالإطارات = مدة تعليقه الصوتي + هامش قبله وبعده */
export const sceneFrames = (p: ChapterProps) =>
  p.chapter.scenes.map((_, i) => Math.ceil((LEAD_IN + (p.audio[i]?.duration ?? 4) + TAIL) * FPS));

export const calculateMetadata: CalculateMetadataFunction<ChapterProps> = ({ props }) => ({
  durationInFrames: Math.max(1, sceneFrames(props).reduce((a, b) => a + b, 0)),
  fps: FPS,
});

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Chapter: React.FC<ChapterProps> = (props) => {
  const { chapter, audio, gradeName } = props;
  const frames = sceneFrames(props);
  const meta = { grade: gradeName, n: chapter.n, title: chapter.title, en: chapter.en };
  let from = 0;
  return (
    <AbsoluteFill>
      <Background accent={chapter.color} />
      {chapter.scenes.map((scene, i) => {
        const dur = frames[i];
        const start = from;
        from += dur;
        const Comp = SCENES[scene.type];
        const a = audio[i];
        return (
          <Sequence key={i} from={start} durationInFrames={dur} name={`${i + 1}. ${scene.type}`}>
            <Fade dur={dur}>
              <Comp scene={scene} dur={dur} accent={chapter.color} meta={meta} />
            </Fade>
            {a && (
              <Sequence from={Math.round(LEAD_IN * FPS)}>
                <Audio src={staticFile(a.file)} />
              </Sequence>
            )}
            {a && <Captions words={a.words} offset={LEAD_IN} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
