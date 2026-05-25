'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserProgress, DayProgress } from '@/types';
import { fetchWithTimeout } from '@/lib/fetchTimeout';

const DEFAULT_PROGRESS: UserProgress = {
  totalXP: 0,
  streak: 0,
  completedDays: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetchWithTimeout('/api/progress');
      if (res.ok) {
        const data = await res.json();
        if (mounted.current) setProgress(data);
      } else {
        if (mounted.current) setProgress(DEFAULT_PROGRESS);
      }
    } catch {
      const saved = localStorage.getItem('eng-progress');
      if (saved && mounted.current) setProgress(JSON.parse(saved));
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveDay = useCallback(async (day: number, score: number, xpEarned: number) => {
    try {
      const res = await fetchWithTimeout('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, score, xpEarned }),
      });
      if (res.ok) {
        const data = await res.json();
        if (mounted.current) setProgress(data);
        return;
      }
    } catch {
      // fallback localStorage
    }
    setProgress(prev => {
      const updated: UserProgress = {
        ...prev,
        totalXP: prev.totalXP + xpEarned,
        completedDays: [
          ...prev.completedDays.filter((d) => d.day !== day),
          { day, completed: true, score, xpEarned, completedAt: new Date().toISOString() },
        ],
      };
      localStorage.setItem('eng-progress', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetProgress = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetchWithTimeout('/api/progress', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (mounted.current) setProgress(data);
        try { localStorage.removeItem('eng-progress'); } catch {}
        return true;
      }
    } catch {
      // ignore
    }
    try { localStorage.removeItem('eng-progress'); } catch {}
    if (mounted.current) setProgress(DEFAULT_PROGRESS);
    return false;
  }, []);

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
    setProgress(prev => {
      const updated = { ...prev, totalXP: prev.totalXP + amount };
      try { localStorage.setItem('eng-progress', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  return { progress, loading, saveDay, addXP, resetProgress, isDayCompleted, isDayUnlocked, getDayScore, refetch: fetchProgress };
}
