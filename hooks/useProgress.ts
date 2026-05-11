'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, DayProgress } from '@/types';

const DEFAULT_PROGRESS: UserProgress = {
  totalXP: 0,
  streak: 0,
  completedDays: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      }
    } catch {
      const saved = localStorage.getItem('eng-progress');
      if (saved) setProgress(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const saveDay = useCallback(async (day: number, score: number, xpEarned: number) => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, score, xpEarned }),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
        return;
      }
    } catch {
      // fallback localStorage
    }
    const updated: UserProgress = {
      ...progress,
      totalXP: progress.totalXP + xpEarned,
      completedDays: [
        ...progress.completedDays.filter((d) => d.day !== day),
        { day, completed: true, score, xpEarned, completedAt: new Date().toISOString() },
      ],
    };
    localStorage.setItem('eng-progress', JSON.stringify(updated));
    setProgress(updated);
  }, [progress]);

  const isDayCompleted = useCallback(
    (day: number) => progress.completedDays.some((d: DayProgress) => d.day === day && d.completed),
    [progress]
  );

  const isDayUnlocked = useCallback(
    (day: number) => day === 1 || isDayCompleted(day - 1),
    [isDayCompleted]
  );

  const getDayScore = useCallback(
    (day: number) => progress.completedDays.find((d: DayProgress) => d.day === day)?.score ?? 0,
    [progress]
  );

  const addXP = useCallback((amount: number) => {
    const updated = { ...progress, totalXP: progress.totalXP + amount };
    try {
      localStorage.setItem('eng-progress', JSON.stringify(updated));
    } catch {}
    setProgress(updated);
  }, [progress]);

  return { progress, loading, saveDay, addXP, isDayCompleted, isDayUnlocked, getDayScore, refetch: fetchProgress };
}
