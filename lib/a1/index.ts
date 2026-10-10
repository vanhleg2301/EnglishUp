import { useMemo, useSyncExternalStore } from 'react';
import { days1to5 } from './days1to5';
import { days6to10 } from './days6to10';
import { days11to15 } from './days11to15';
import { days16to20 } from './days16to20';
import type { A1Day } from './types';

export * from './types';

export const a1Days: A1Day[] = [...days1to5, ...days6to10, ...days11to15, ...days16to20];

export function getA1Day(day: number): A1Day | undefined {
  return a1Days.find((d) => d.day === day);
}

export const A1_PROGRESS_KEY = 'a1-progress';
export const A1_XP = 30;
/** Offset so A1 words don't collide with lesson days (1–30) or Fast Talk (1000+) in SRS `sourceDay`. */
export const A1_SRS_SOURCE_OFFSET = 2000;

function readRaw(): string | null {
  try {
    return localStorage.getItem(A1_PROGRESS_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): number[] {
  try {
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

/** Returns true the first time a day is completed. */
export function markA1DayDone(day: number): boolean {
  const done = parse(readRaw());
  if (done.includes(day)) return false;
  try {
    localStorage.setItem(A1_PROGRESS_KEY, JSON.stringify([...done, day]));
  } catch { /* storage unavailable */ }
  return true;
}

const subscribeNoop = () => () => {};

/** Completed day numbers. Snapshots the raw string so the value is stable between renders. */
export function useA1Progress(): number[] {
  const raw = useSyncExternalStore(subscribeNoop, readRaw, () => null);
  return useMemo(() => parse(raw), [raw]);
}
