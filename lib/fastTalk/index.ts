import { useMemo, useSyncExternalStore } from 'react';
import { unitsA2 } from './unitsA2';
import { unitsB1 } from './unitsB1';
import type { FastTalkUnit } from './types';

export * from './types';

export const fastTalkUnits: FastTalkUnit[] = [...unitsA2, ...unitsB1];

export function getFastTalkUnit(id: number): FastTalkUnit | undefined {
  return fastTalkUnits.find((u) => u.id === id);
}

export const FAST_TALK_PROGRESS_KEY = 'fast-talk-progress';
export const FAST_TALK_XP = 40;
/** Offset so Fast Talk chunks don't collide with lesson day numbers in SRS `sourceDay`. */
export const FAST_TALK_SRS_SOURCE_OFFSET = 1000;

function readRaw(): string | null {
  try {
    return localStorage.getItem(FAST_TALK_PROGRESS_KEY);
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

export function loadFastTalkProgress(): number[] {
  if (typeof window === 'undefined') return [];
  return parse(readRaw());
}

export function markFastTalkUnitDone(id: number): boolean {
  const done = loadFastTalkProgress();
  if (done.includes(id)) return false;
  try {
    localStorage.setItem(FAST_TALK_PROGRESS_KEY, JSON.stringify([...done, id]));
  } catch { /* storage unavailable */ }
  return true;
}

const subscribeNoop = () => () => {};

/** Completed unit ids. Snapshots the raw string so the value is stable between renders. */
export function useFastTalkProgress(): number[] {
  const raw = useSyncExternalStore(subscribeNoop, readRaw, () => null);
  return useMemo(() => parse(raw), [raw]);
}
