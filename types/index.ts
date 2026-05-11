export type ExerciseType =
  | 'multiple-choice'
  | 'word-order'
  | 'fill-blank'
  | 'listen-choose'
  | 'word-match'
  | 'speaking'
  | 'pronunciation';

export type LessonTheme = 'office' | 'travel' | 'tech' | 'career' | 'review';

export interface VocabItem {
  word: string;
  translation: string;
  phonetic: string;
  example: string;
  exampleTranslation: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  audioText?: string;
  options?: string[];
  correct: string;
  words?: string[];
  pairs?: [string, string][];
  hint?: string;
}

export interface DayLesson {
  day: number;
  title: string;
  subtitle: string;
  theme: LessonTheme;
  emoji: string;
  gradient: [string, string];
  vocabulary: VocabItem[];
  exercises: Exercise[];
  xpReward: number;
}

export interface DayProgress {
  day: number;
  completed: boolean;
  score: number;
  xpEarned: number;
  completedAt?: string;
}

export interface UserProgress {
  totalXP: number;
  streak: number;
  lastLoginDate?: string;
  completedDays: DayProgress[];
}
