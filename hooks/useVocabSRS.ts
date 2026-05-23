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

function loadLocal(): SRSCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(cards: SRSCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

async function syncToAPI(cards: SRSCard[]) {
  try {
    await fetch('/api/vocab-srs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards }),
    });
  } catch {
    // offline — localStorage already saved, will sync on next online session
  }
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
    async function load() {
      try {
        const res = await fetch('/api/vocab-srs');
        if (res.ok) {
          const data = await res.json();
          const apiCards: SRSCard[] = data.cards ?? [];
          // API has data → use it as source of truth
          if (apiCards.length > 0) {
            setCards(apiCards);
            saveLocal(apiCards);
            setLoaded(true);
            return;
          }
          // API empty but localStorage has cards → migrate to API
          const local = loadLocal();
          if (local.length > 0) {
            setCards(local);
            syncToAPI(local);
            setLoaded(true);
            return;
          }
        }
      } catch {
        // offline or not auth'd
      }
      setCards(loadLocal());
      setLoaded(true);
    }
    load();
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
      saveLocal(updated);
      syncToAPI(updated);
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
      saveLocal(updated);
      syncToAPI(updated);
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
