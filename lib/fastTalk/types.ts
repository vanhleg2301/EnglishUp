export type FastTalkLevel = 'A2+' | 'B1';
export type FastTalkTrack = 'life' | 'work';

export interface FTLine {
  speaker: string;
  text: string;
  vi: string;
}

export interface FTQuestion {
  q: string;
  options: string[];
  answer: number;
}

/** How a phrase is actually pronounced at natural speed (linking, reductions). */
export interface FTConnectedSpeech {
  written: string;
  spoken: string;
  note: string;
}

export interface FTChunk {
  en: string;
  vi: string;
  example: string;
  exampleVi: string;
}

/** Vietnamese prompt → user must say the English sentence fast. */
export interface FTDrill {
  vi: string;
  en: string;
  /** Other acceptable answers, scored the same as `en`. */
  accept?: string[];
}

/** One sentence frame, several slots to swap in — trains reusing a pattern. */
export interface FTPattern {
  frame: string;
  meaning: string;
  slots: FTDrill[];
}

export interface FTRoleplayLine {
  speaker: 'you' | 'them';
  text: string;
  vi: string;
}

export interface FastTalkUnit {
  id: number;
  level: FastTalkLevel;
  track: FastTalkTrack;
  title: string;
  titleVi: string;
  emoji: string;
  situation: string;
  dialogue: FTLine[];
  questions: FTQuestion[];
  connectedSpeech: FTConnectedSpeech[];
  chunks: FTChunk[];
  drills: FTDrill[];
  pattern: FTPattern;
  roleplay: { scenario: string; lines: FTRoleplayLine[] };
}
