export interface LevelInfo {
  name: string;
  minXP: number;
  maxXP: number | null;
  color: string;
  bg: string;
  border: string;
  emoji: string;
}

export const LEVELS: LevelInfo[] = [
  { name: 'Beginner',     minXP: 0,     maxXP: 499,   color: 'text-slate-300',   bg: 'bg-slate-500/10',   border: 'border-slate-500/25',   emoji: '🌱' },
  { name: 'Elementary',   minXP: 500,   maxXP: 1499,  color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', emoji: '📗' },
  { name: 'Intermediate', minXP: 1500,  maxXP: 3999,  color: 'text-cyan-300',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    emoji: '🔵' },
  { name: 'Advanced',     minXP: 4000,  maxXP: 9999,  color: 'text-violet-300',  bg: 'bg-violet-500/10',  border: 'border-violet-500/25',  emoji: '💜' },
  { name: 'Master',       minXP: 10000, maxXP: null,  color: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   emoji: '👑' },
];

export function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(xp: number): number {
  const level = getLevelInfo(xp);
  if (!level.maxXP) return 100;
  const range = level.maxXP - level.minXP;
  const earned = xp - level.minXP;
  return Math.min(100, Math.round((earned / range) * 100));
}

export function getXPToNextLevel(xp: number): number {
  const level = getLevelInfo(xp);
  if (!level.maxXP) return 0;
  return level.maxXP - xp + 1;
}
