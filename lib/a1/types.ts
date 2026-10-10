/**
 * A1 course content, built around comprehensible input: new words are met
 * through a picture and simple sentences first, then reused heavily in a
 * short story and a dialogue. Vietnamese is available on tap, never first.
 */

export interface A1Word {
  word: string;
  vi: string;
  emoji: string;
  /** Other spellings to highlight in the story (plural, verb forms…). */
  forms?: string[];
  examples: string[];
}

export interface A1Sentence {
  en: string;
  vi: string;
}

/** Yes/No question about the story — answered by listening. */
export interface A1Question {
  q: string;
  vi: string;
  answer: boolean;
}

export interface A1Line {
  speaker: string;
  text: string;
  vi: string;
}

/** A question about the learner's own life, with a model answer to adapt. */
export interface A1SpeakPrompt {
  q: string;
  vi: string;
  model: string;
  modelVi: string;
}

export interface A1Day {
  day: number;
  title: string;
  titleVi: string;
  emoji: string;
  /** "Sau bài này bạn có thể…" */
  goal: string;
  words: A1Word[];
  story: { title: string; sentences: A1Sentence[]; questions: A1Question[] };
  dialogue: { context: string; lines: A1Line[] };
  speak: A1SpeakPrompt[];
  /** One short grammar/usage note in Vietnamese. */
  tip: string;
}
