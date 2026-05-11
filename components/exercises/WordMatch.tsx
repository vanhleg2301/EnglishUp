'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { Exercise } from '@/types';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}

type MatchItem = { text: string; lang: 'en' | 'vi'; pairIndex: number; id: string };

export default function WordMatch({ exercise, onComplete }: Props) {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selected, setSelected] = useState<MatchItem | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  useEffect(() => {
    const pairs = exercise.pairs ?? [];
    const enItems: MatchItem[] = pairs.map((p, i) => ({ text: p[0], lang: 'en', pairIndex: i, id: `en-${i}` }));
    const viItems: MatchItem[] = pairs.map((p, i) => ({ text: p[1], lang: 'vi', pairIndex: i, id: `vi-${i}` }));
    const shuffledEn = enItems.sort(() => Math.random() - 0.5);
    const shuffledVi = viItems.sort(() => Math.random() - 0.5);
    setItems([...shuffledEn, ...shuffledVi]);
    setMatched(new Set());
    setSelected(null);
  }, [exercise]);

  const handleSelect = (item: MatchItem) => {
    if (matched.has(item.id)) return;
    if (!selected) {
      setSelected(item);
      return;
    }
    if (selected.id === item.id) {
      setSelected(null);
      return;
    }
    if (selected.lang === item.lang) {
      setSelected(item);
      return;
    }
    if (selected.pairIndex === item.pairIndex) {
      const newMatched = new Set(matched);
      newMatched.add(selected.id);
      newMatched.add(item.id);
      setMatched(newMatched);
      setSelected(null);
      if (newMatched.size === items.length) {
        setTimeout(() => onComplete(true), 800);
      }
    } else {
      setWrongPair(`${selected.id}-${item.id}`);
      setTimeout(() => { setWrongPair(null); setSelected(null); }, 600);
    }
  };

  const enItems = items.filter((i) => i.lang === 'en');
  const viItems = items.filter((i) => i.lang === 'vi');

  const getStyle = (item: MatchItem) => {
    if (matched.has(item.id)) return 'border-emerald-500 bg-emerald-500/20 text-emerald-300 opacity-60';
    const isWrong = wrongPair && (wrongPair.includes(item.id));
    if (isWrong) return 'border-red-500 bg-red-500/20 text-red-300';
    if (selected?.id === item.id) return 'border-violet-400 bg-violet-500/30 text-white scale-[1.03]';
    return 'border-white/15 bg-white/5 text-white/80 hover:border-violet-400 hover:bg-violet-500/10';
  };

  return (
    <div className="space-y-5">
      <p className="text-xl font-semibold text-white text-center">{exercise.question}</p>
      <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
        <span>{matched.size / 2}/{items.length / 2} cặp</span>
        <div className="flex gap-1">
          {Array.from({ length: items.length / 2 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${matched.size / 2 > i ? 'bg-emerald-400' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-xs text-center text-white/40 font-semibold uppercase tracking-wider">English</p>
          {enItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(item)}
              className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 flex items-center justify-between gap-2 ${getStyle(item)}`}
            >
              <span className="text-left">{item.text}</span>
              <AnimatePresence>
                {matched.has(item.id) && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs text-center text-white/40 font-semibold uppercase tracking-wider">Tiếng Việt</p>
          {viItems.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(item)}
              className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 flex items-center justify-between gap-2 ${getStyle(item)}`}
            >
              <span className="text-left">{item.text}</span>
              <AnimatePresence>
                {matched.has(item.id) && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
