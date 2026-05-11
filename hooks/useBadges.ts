'use client';

import { useState, useEffect, useCallback } from 'react';
import { shadowingItems } from '@/lib/shadowingData';

const STORAGE_KEY = 'eng-badges';

export type BadgeId = 'streak-7' | 'streak-30' | 'first-conversation' | 'pronunciation-pro' | 'shadowing-master';

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
}

const DEFAULT_DATA: BadgeData = {
  earned: [],
  consecutivePronScores: 0,
  completedB2Ids: [],
  conversationOpened: false,
};

export const ALL_BADGES: BadgeInfo[] = [
  { id: 'streak-7', title: '7-Day Streak', description: 'Duy trì streak 7 ngày liên tiếp', icon: '🔥' },
  { id: 'streak-30', title: '30-Day Streak', description: 'Duy trì streak 30 ngày liên tiếp', icon: '⚡' },
  { id: 'first-conversation', title: 'First Conversation', description: 'Nghe hội thoại thực tế lần đầu', icon: '💬' },
  { id: 'pronunciation-pro', title: 'Pronunciation Pro', description: 'Đạt >80% trong 5 lần shadow liên tiếp', icon: '🎤' },
  { id: 'shadowing-master', title: 'Shadowing Master', description: 'Hoàn thành tất cả câu B2', icon: '🏆' },
];

const B2_IDS = shadowingItems.filter((i) => i.level === 'B2').map((i) => i.id);

function awardBadge(d: BadgeData, id: BadgeId): BadgeData {
  if (d.earned.find((e) => e.id === id)) return d;
  return { ...d, earned: [...d.earned, { id, earnedAt: new Date().toISOString() }] };
}

export function useBadges() {
  const [data, setData] = useState<BadgeData>(DEFAULT_DATA);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  const save = useCallback((updated: BadgeData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setData(updated);
  }, []);

  const hasEarned = useCallback((id: BadgeId) => Boolean(data.earned.find((e) => e.id === id)), [data]);

  const trackShadowingScore = useCallback((score: number) => {
    let d = { ...data };
    if (score >= 80) {
      d.consecutivePronScores += 1;
      if (d.consecutivePronScores >= 5) {
        d = awardBadge(d, 'pronunciation-pro');
      }
    } else {
      d.consecutivePronScores = 0;
    }
    save(d);
  }, [data, save]);

  const trackB2Complete = useCallback((id: string) => {
    let d = { ...data };
    if (!d.completedB2Ids.includes(id)) {
      d.completedB2Ids = [...d.completedB2Ids, id];
    }
    if (B2_IDS.every((bid) => d.completedB2Ids.includes(bid))) {
      d = awardBadge(d, 'shadowing-master');
    }
    save(d);
  }, [data, save]);

  const trackConversationOpened = useCallback(() => {
    if (data.conversationOpened) return;
    let d = { ...data, conversationOpened: true };
    d = awardBadge(d, 'first-conversation');
    save(d);
  }, [data, save]);

  const checkStreakBadges = useCallback((streak: number) => {
    let d = { ...data };
    let changed = false;
    if (streak >= 7 && !d.earned.find((e) => e.id === 'streak-7')) {
      d = awardBadge(d, 'streak-7');
      changed = true;
    }
    if (streak >= 30 && !d.earned.find((e) => e.id === 'streak-30')) {
      d = awardBadge(d, 'streak-30');
      changed = true;
    }
    if (changed) save(d);
  }, [data, save]);

  const earnedBadges = ALL_BADGES.filter((b) => data.earned.find((e) => e.id === b.id));

  return {
    earnedBadges,
    hasEarned,
    trackShadowingScore,
    trackB2Complete,
    trackConversationOpened,
    checkStreakBadges,
  };
}
