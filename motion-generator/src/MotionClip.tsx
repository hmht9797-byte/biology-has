import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
// The same engine the app uses (app/motion_engine.js), so the MP4 matches what students see in the booklet.
// @ts-ignore: plain JavaScript module without type declarations
import MGModule from '../../app/motion_engine.js';
import { FPS, loadFonts } from './theme';

type Engine = {
  svg: (data: unknown, meta: MotionMeta) => string;
  timeline: (data: unknown) => { total: number };
};
const MG = ((MGModule as unknown as Engine | undefined)?.svg ? MGModule : (globalThis as unknown as { MG: Engine }).MG) as Engine;

export interface MotionMeta { key: string; grade: string; gradeId: number; n: number; title: string; color: string }
export interface MotionProps { data: unknown; meta: MotionMeta; audio?: string }

export const motionMetadata = ({ props }: { props: MotionProps }) => ({
  durationInFrames: Math.ceil(MG.timeline(props.data).total * FPS),
});

/** Draws the chapter's motion graphic and seeks every CSS animation to the current frame (deterministic rendering). */
export const MotionClip: React.FC<MotionProps> = ({ data, meta, audio }) => {
  loadFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => MG.svg(data, meta), [data, meta]);
  useLayoutEffect(() => {
    const svg = ref.current?.querySelector('svg');
    if (!svg) return;
    svg.getBoundingClientRect();
    for (const a of svg.getAnimations({ subtree: true })) { a.pause(); a.currentTime = (frame / fps) * 1000; }
  }, [frame, fps, html]);
  return (
    <AbsoluteFill style={{ background: '#03130e' }}>
      <style>{'.mgclip>svg{display:block;width:100%;height:100%}'}</style>
      <div ref={ref} className="mgclip" style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: html }} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
