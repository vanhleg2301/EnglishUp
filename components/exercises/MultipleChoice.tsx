'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Exercise } from '@/types';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}

export default function MultipleChoice({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const selectedRef = useRef<string | null>(null);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    setTimeout(() => onComplete(selected === exercise.correct), 1200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (submitted) return;
      const idx = parseInt(e.key) - 1;
      if (!isNaN(idx) && idx >= 0 && exercise.options && idx < exercise.options.length) {
        setSelected(exercise.options[idx]);
        return;
      }
      if (e.key === 'Enter' && selectedRef.current) {
        setSubmitted(true);
        setTimeout(() => onComplete(selectedRef.current! === exercise.correct), 1200);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submitted, exercise.options, exercise.correct, onComplete]);

  const getOptionStyle = (option: string) => {
    if (!submitted) {
      return selected === option
        ? 'border-violet-500 bg-violet-500/20 text-white'
        : 'border-white/10 bg-white/5 text-white/80 hover:border-violet-400 hover:bg-violet-500/10';
    }
    if (option === exercise.correct) return 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
    if (option === selected && option !== exercise.correct) return 'border-red-500 bg-red-500/20 text-red-300';
    return 'border-white/10 bg-white/5 text-white/40';
  };

  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold text-white text-center">{exercise.question}</p>
      {exercise.hint && (
        <p className="text-sm text-white/40 text-center italic">Gợi ý: {exercise.hint}</p>
      )}
      <div className="grid grid-cols-1 gap-3 mt-6">
        {exercise.options?.map((option, i) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(option)}
            className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all duration-200 flex items-center justify-between ${getOptionStyle(option)}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-white/10 text-white/40 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              <span>{option}</span>
            </div>
            <AnimatePresence>
              {submitted && option === exercise.correct && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </motion.span>
              )}
              {submitted && option === selected && option !== exercise.correct && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <XCircle className="w-5 h-5 text-red-400" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={!selected || submitted}
        className="w-full mt-4 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Kiểm tra
      </motion.button>
    </div>
  );
}
