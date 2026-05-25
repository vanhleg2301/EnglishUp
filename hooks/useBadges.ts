'use client';

import { useState, useEffect, useCallback } from 'react';
import { shadowingItems } from '@/lib/shadowingData';
import { fetchWithTimeout } from '@/lib/fetchTimeout';

const STORAGE_KEY = 'eng-badges';

export type BadgeId = 'streak-7' | 'streak-30' | 'first-conversation' | 'pronunciation-pro' | 'shadowing-master' | 'vocab-master' | 'sg-sprint-complete' | 'perfect-week';

export interface BadgeInfo {
  id: BadgeId;
  title: string;
  description: string;
  icon: string;
}

interface BadgeData {
  earned: { id: BadgeId; earnedAt: string }[];
  consecutivePronScores: number;
  completedB2Ids: string[];
  conversationOpened: boolean;
  totalVocabReviewed: number;
  sgSprintCompleted: boolean;
}

const DEFAULT_DATA: BadgeData = {
  earned: [],
  consecutivePronScores: 0,
  completedB2Ids: [],
  conversationOpened: false,
  totalVocabReviewed: 0,
  sgSprintCompleted: false,
};

export const ALL_BADGES: BadgeInfo[] = [
  { id: 'streak-7',           title: '7-Day Streak',       description: 'Duy trì streak 7 ngày liên tiếp',               icon: '🔥' },
  { id: 'streak-30',          title: '30-Day Streak',      description: 'Duy trì streak 30 ngày liên tiếp',              icon: '⚡' },
  { id: 'first-conversation', title: 'First Conversation', description: 'Nghe hội thoại thực tế lần đầu',                icon: '💬' },
  { id: 'pronunciation-pro',  title: 'Pronunciation Pro',  description: 'Đạt >80% trong 5 lần shadow liên tiếp',         icon: '🎤' },
  { id: 'shadowing-master',   title: 'Shadowing Master',   description: 'Hoàn thành tất cả câu B2',                      icon: '🏆' },
  { id: 'vocab-master',       title: 'Vocab Master',       description: 'Ôn tập 50 flashcard SRS thành công',            icon: '📚' },
  { id: 'sg-sprint-complete', title: 'SG Sprint Complete', description: 'Hoàn thành toàn bộ 15 ngày SG Speaking Sprint', icon: '🇸🇬' },
  { id: 'perfect-week',       title: 'Perfect Week',       description: 'Streak đạt 7 ngày và học đều mỗi ngày',         icon: '🌟' },
];

const B2_IDS = shadowingItems.filter((i) => i.level === 'B2').map((i) => i.id);

function awardBadge(d: BadgeData, id: BadgeId): BadgeData {
  if (d.earned.find((e) => e.id === id)) return d;
  return { ...d, earned: [...d.earned, { id, earnedAt: new Date().toISOString() }] };
}

function saveLocal(d: BadgeData): BadgeData {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  return d;
}

async function syncToAPI(d: BadgeData) {
  try {
    await fetch('/api/badges', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
  } catch {
    // offline — localStorage already saved
  }
}

function persist(d: BadgeData): BadgeData {
  saveLocal(d);
  syncToAPI(d);
  return d;
}

export function useBadges() {
  const [data, setData] = useState<BadgeData>(DEFAULT_DATA);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithTimeout('/api/badges');
        if (res.ok) {
          const apiData: BadgeData | null = await res.json();
          if (apiData && apiData.earned !== undefined) {
            setData(apiData);
            saveLocal(apiData);
            return;
          }
          // API empty → migrate localStorage to API
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const local: BadgeData = JSON.parse(raw);
            setData(local);
            syncToAPI(local);
            return;
          }
        }
      } catch {
        // offline or not auth'd
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    }
    load();
  }, []);

  const hasEarned = useCallback((id: BadgeId) => Boolean(data.earned.find((e) => e.id === id)), [data]);

  const trackShadowingScore = useCallback((score: number) => {
    setData(prev => {
      let d = { ...prev };
      if (score >= 80) {
        d.consecutivePronScores += 1;
        if (d.consecutivePronScores >= 5) d = awardBadge(d, 'pronunciation-pro');
      } else {
        d.consecutivePronScores = 0;
      }
      return persist(d);
    });
  }, []);

  const trackB2Complete = useCallback((id: string) => {
    setData(prev => {
      let d = { ...prev };
      if (!d.completedB2Ids.includes(id)) d.completedB2Ids = [...d.completedB2Ids, id];
      if (B2_IDS.every((bid) => d.completedB2Ids.includes(bid))) d = awardBadge(d, 'shadowing-master');
      return persist(d);
    });
  }, []);

  const trackConversationOpened = useCallback(() => {
    setData(prev => {
      if (prev.conversationOpened) return prev;
      return persist(awardBadge({ ...prev, conversationOpened: true }, 'first-conversation'));
    });
  }, []);

  const checkStreakBadges = useCallback((streak: number) => {
    setData(prev => {
      let d = { ...prev };
      let changed = false;
      if (streak >= 7 && !d.earned.find((e) => e.id === 'streak-7')) { d = awardBadge(d, 'streak-7'); changed = true; }
      if (streak >= 30 && !d.earned.find((e) => e.id === 'streak-30')) { d = awardBadge(d, 'streak-30'); changed = true; }
      return changed ? persist(d) : prev;
    });
  }, []);

  const trackVocabReviewed = useCallback((count: number) => {
    setData(prev => {
      let d = { ...prev, totalVocabReviewed: prev.totalVocabReviewed + count };
      if (d.totalVocabReviewed >= 50) d = awardBadge(d, 'vocab-master');
      return persist(d);
    });
  }, []);

  const trackSGSprintComplete = useCallback(() => {
    setData(prev => {
      if (prev.sgSprintCompleted) return prev;
      return persist(awardBadge({ ...prev, sgSprintCompleted: true }, 'sg-sprint-complete'));
    });
  }, []);

  const checkPerfectWeek = useCallback((streak: number) => {
    if (streak < 7) return;
    setData(prev => persist(awardBadge(prev, 'perfect-week')));
  }, []);

  const earnedBadges = ALL_BADGES.filter((b) => data.earned.find((e) => e.id === b.id));

  return {
    earnedBadges,
    hasEarned,
    trackShadowingScore,
    trackB2Complete,
    trackConversationOpened,
    checkStreakBadges,
    trackVocabReviewed,
    trackSGSprintComplete,
    checkPerfectWeek,
  };
}
