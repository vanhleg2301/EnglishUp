'use client';

import { useState, useEffect, useCallback } from 'react';
import { CHALLENGE_POOL } from '@/lib/dailyChallengeData';
import type { DailyChallenge } from '@/lib/dailyChallengeData';

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

const PERIOD_MS = 2 * 60 * 1000; // 2 minutes

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

export function useDailyChallenge() {
  const [data, setData] = useState<ChallengeData>(DEFAULT_DATA);
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let d: ChallengeData = saved ? JSON.parse(saved) : { ...DEFAULT_DATA };

    const current = getPeriodKey();
    const prev = getPeriodKey(Date.now() - PERIOD_MS);
    if (d.lastDate && d.lastDate !== current && d.lastDate !== prev) {
      d = { ...d, streak: 0 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    }

    setData(d);
    setLoading(false);
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
