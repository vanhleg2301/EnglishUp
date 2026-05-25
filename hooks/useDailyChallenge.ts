'use client';

import { useState, useEffect, useCallback } from 'react';
import { CHALLENGE_POOL } from '@/lib/dailyChallengeData';
import type { DailyChallenge } from '@/lib/dailyChallengeData';
import { fetchWithTimeout } from '@/lib/fetchTimeout';

const STORAGE_KEY = 'eng-challenge-data';

interface ChallengeHistoryEntry {
  challengeId: string;
  selectedId: string;
  correct: boolean;
  completedAt: string;
}

interface ChallengeData {
  streak: number;
  lastDate: string;
  history: Record<string, ChallengeHistoryEntry>;
}

const DEFAULT_DATA: ChallengeData = {
  streak: 0,
  lastDate: '',
  history: {},
};

const PERIOD_MS = 2 * 60 * 1000;

function getPeriodKey(ts = Date.now()): string {
  return String(Math.floor(ts / PERIOD_MS));
}

function getCurrentChallenge(): DailyChallenge {
  const period = Math.floor(Date.now() / PERIOD_MS);
  return CHALLENGE_POOL[period % CHALLENGE_POOL.length];
}

function getMsUntilReset(): number {
  const now = Date.now();
  return PERIOD_MS - (now % PERIOD_MS);
}

function formatCountdown(ms: number): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function saveLocal(d: ChallengeData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

async function syncToAPI(d: ChallengeData) {
  try {
    await fetch('/api/daily-challenge', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
  } catch {
    // offline — localStorage already saved
  }
}

function resetExpiredStreak(d: ChallengeData): ChallengeData {
  const current = getPeriodKey();
  const prev = getPeriodKey(Date.now() - PERIOD_MS);
  if (d.lastDate && d.lastDate !== current && d.lastDate !== prev) {
    return { ...d, streak: 0 };
  }
  return d;
}

export function useDailyChallenge() {
  const [data, setData] = useState<ChallengeData>(DEFAULT_DATA);
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithTimeout('/api/daily-challenge');
        if (res.ok) {
          const apiData: ChallengeData | null = await res.json();
          if (apiData && 'streak' in apiData) {
            const d = resetExpiredStreak(apiData);
            setData(d);
            saveLocal(d);
            setLoading(false);
            return;
          }
          // API empty → migrate localStorage
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const local: ChallengeData = resetExpiredStreak(JSON.parse(raw));
            setData(local);
            syncToAPI(local);
            setLoading(false);
            return;
          }
        }
      } catch {
        // offline or not auth'd
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      const d = raw ? resetExpiredStreak(JSON.parse(raw)) : { ...DEFAULT_DATA };
      if (raw) saveLocal(d);
      setData(d);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(getMsUntilReset()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const challenge = getCurrentChallenge();
  const currentPeriod = getPeriodKey();
  const todayHistory = data.history[currentPeriod] ?? null;
  const isCompleted = Boolean(todayHistory);

  const submitAnswer = useCallback((selectedId: string): boolean => {
    const correct = selectedId === challenge.correctId;
    const current = getPeriodKey();

    const entry: ChallengeHistoryEntry = {
      challengeId: challenge.id,
      selectedId,
      correct,
      completedAt: new Date().toISOString(),
    };

    let newStreak = data.streak;
    if (!data.history[current]) {
      const prev = getPeriodKey(Date.now() - PERIOD_MS);
      if (data.lastDate === prev || data.streak === 0) {
        newStreak = data.streak + 1;
      } else if (data.lastDate !== current) {
        newStreak = 1;
      }
    }

    const updated: ChallengeData = {
      streak: newStreak,
      lastDate: current,
      history: { ...data.history, [current]: entry },
    };

    saveLocal(updated);
    syncToAPI(updated);
    setData(updated);
    return correct;
  }, [challenge, data]);

  return {
    challenge,
    isCompleted,
    todayHistory,
    streak: data.streak,
    countdown,
    loading,
    submitAnswer,
  };
}
