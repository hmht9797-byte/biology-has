import React from 'react';
import { Composition } from 'remotion';
import { MotionClip, motionMetadata, type MotionProps } from './MotionClip';
import { FPS } from './theme';

// Preview in Remotion Studio only; scripts/export_mp4.mjs passes the real chapter with --props.
const preview: MotionProps = {
  data: { idea: 'معاينة', scenes: [{ type: 'points', cap: 'معاينة', points: ['أ', 'ب'] }, { type: 'summary', points: ['أ', 'ب'] }] },
  meta: { key: 'preview', grade: 'الثاني المتوسط', gradeId: 2, n: 1, title: 'علم التصنيف', color: '#127a5d' },
};

export const Root: React.FC = () => (
  <Composition
    id="Motion"
    component={MotionClip as unknown as React.FC<Record<string, unknown>>}
    width={1920}
    height={1080}
    fps={FPS}
    durationInFrames={300}
    defaultProps={preview as unknown as Record<string, unknown>}
    calculateMetadata={motionMetadata as never}
  />
);
