'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SRSCard {
  word: string;
  translation: string;
  phonetic: string;
  example: string;
  exampleTranslation?: string;
  sourceDay: number;
  interval: number;
  ease: number;
  reviews: number;
  dueDate: string;
  lastReviewed?: string;
}

export type SRSRating = 0 | 1 | 2 | 3;

const INTERVALS: Record<SRSRating, number> = { 0: 1, 1: 3, 2: 7, 3: 14 };
const EASE_DELTA: Record<SRSRating, number> = { 0: -0.3, 1: -0.1, 2: 0, 3: 0.15 };
const MIN_EASE = 1.3;
const STORAGE_KEY = 'eng-vocab-srs';

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function loadCards(): SRSCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCards(cards: SRSCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export interface SRSStats {
  total: number;
  dueToday: number;
  newToday: number;
  reviewed: number;
  masteredCount: number;
}

export function useVocabSRS() {
  const [cards, setCards] = useState<SRSCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCards(loadCards());
    setLoaded(true);
  }, []);

  const addNewCards = useCallback((
    vocabItems: { word: string; translation: string; phonetic: string; example: string; exampleTranslation?: string }[],
    sourceDay: number
  ) => {
    setCards(prev => {
      const existingWords = new Set(prev.map(c => c.word));
      const newCards: SRSCard[] = vocabItems
        .filter(v => !existingWords.has(v.word))
        .map(v => ({
          word: v.word,
          translation: v.translation,
          phonetic: v.phonetic,
          example: v.example,
          exampleTranslation: v.exampleTranslation,
          sourceDay,
          interval: 0,
          ease: 2.5,
          reviews: 0,
          dueDate: today(),
        }));
      if (newCards.length === 0) return prev;
      const updated = [...prev, ...newCards];
      saveCards(updated);
      return updated;
    });
  }, []);

  const reviewCard = useCallback((word: string, rating: SRSRating) => {
    setCards(prev => {
      const updated = prev.map(card => {
        if (card.word !== word) return card;
        const newEase = Math.max(MIN_EASE, card.ease + EASE_DELTA[rating]);
        const baseInterval = INTERVALS[rating];
        const newInterval = card.reviews === 0 ? baseInterval : Math.round(card.interval * newEase * (baseInterval / 7));
        return {
          ...card,
          ease: newEase,
          interval: Math.max(baseInterval, newInterval),
          reviews: card.reviews + 1,
          dueDate: addDays(Math.max(baseInterval, newInterval)),
          lastReviewed: today(),
        };
      });
      saveCards(updated);
      return updated;
    });
  }, []);

  const dueCards = cards.filter(c => c.dueDate <= today());
  const masteredCount = cards.filter(c => c.interval >= 14).length;

  const stats: SRSStats = {
    total: cards.length,
    dueToday: dueCards.length,
    newToday: cards.filter(c => c.reviews === 0 && c.dueDate <= today()).length,
    reviewed: cards.filter(c => c.lastReviewed === today()).length,
    masteredCount,
  };

  return { cards, dueCards, addNewCards, reviewCard, stats, loaded };
}
