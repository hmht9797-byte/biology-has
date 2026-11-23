import React from 'react';
import { Composition } from 'remotion';
import { calculateMetadata, Chapter } from './Chapter';
import type { ChapterProps } from './types';

// القيم الافتراضية للمعاينة في Remotion Studio فقط؛ الإنتاج يمرّر --props من scripts/produce_and_upload.mjs
const preview: ChapterProps = {
  key: 'preview',
  gradeName: 'الثاني المتوسط',
  chapter: { n: 1, title: 'علم التصنيف', color: '#258656', scenes: [{ type: 'title', narration: '' }] },
  audio: [],
};

export const Root: React.FC = () => (
  <Composition
    id="Chapter"
    component={Chapter as unknown as React.FC<Record<string, unknown>>}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={150}
    defaultProps={preview as unknown as Record<string, unknown>}
    calculateMetadata={calculateMetadata as never}
  />
);
