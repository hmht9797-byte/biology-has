/** مشهد واحد من سكربت الفصل: نوع القالب البصري، والتعليق الصوتي، ومعطيات الرسم */
export type Organ = 'heart' | 'lungs' | 'neuron' | 'leaf' | 'eye' | 'kidney' | 'flower' | 'microscope' | 'bone' | 'stomach';

export type Scene =
  | { type: 'title'; narration: string }
  | { type: 'definition'; heading: string; narration: string; text: string }
  | { type: 'timeline'; heading: string; narration: string; items: { year: string; label: string }[] }
  | { type: 'hierarchy'; heading: string; narration: string; levels: string[]; note?: string }
  | { type: 'cell'; heading: string; narration: string; variant: 'animal' | 'plant' | 'bacteria'; labels: string[] }
  | { type: 'organ'; heading: string; narration: string; organ: Organ; labels: string[] }
  | { type: 'tissue'; heading: string; narration: string; labels: string[] }
  | { type: 'compare'; heading: string; narration: string; left: { title: string; points: string[] }; right: { title: string; points: string[] } }
  | { type: 'process'; heading: string; narration: string; steps: string[] }
  | { type: 'cycle'; heading: string; narration: string; steps: string[] }
  | { type: 'division'; heading: string; narration: string; phases: string[] }
  | { type: 'dna'; heading: string; narration: string; labels: string[] }
  | { type: 'list'; heading: string; narration: string; points: string[] }
  | { type: 'summary'; narration: string; points: string[] };

export interface ChapterScript {
  n: number;
  title: string;
  en?: string;
  color: string;
  scenes: Scene[];
}

export interface Grade {
  id: number;
  name: string;
  chapters: ChapterScript[];
}

export interface Curriculum {
  voice: string;
  grades: Grade[];
}

/** ما ينتجه scripts/tts.py لكل مشهد: ملف الصوت ومدته وتوقيت كل كلمة (بالثواني) */
export interface SceneAudio {
  file: string; // نسبي إلى public/
  duration: number;
  words: { t: number; d: number; w: string }[];
}

export interface ChapterProps {
  key: string;
  gradeName: string;
  chapter: ChapterScript;
  audio: SceneAudio[];
  [k: string]: unknown;
}
