'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Exercise } from '@/types';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}

export default function FillBlank({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const parts = exercise.question.split('___');

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => onComplete(selected === exercise.correct), 1200);
  };

  const getStyle = (option: string) => {
    if (!submitted) {
      return selected === option
        ? 'border-violet-500 bg-violet-500/20 text-white scale-[1.02]'
        : 'border-white/10 bg-white/5 text-white/80 hover:border-violet-400 hover:bg-violet-500/10';
    }
    if (option === exercise.correct) return 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
    if (option === selected) return 'border-red-500 bg-red-500/20 text-red-300';
    return 'border-white/10 bg-white/5 text-white/30';
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-white/60 text-center">Điền từ thích hợp vào chỗ trống</p>

      {/* Sentence with blank */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
        <p className="text-2xl font-semibold text-white leading-relaxed">
          {parts[0]}
          <span
            className={`inline-block mx-1 px-4 py-0.5 rounded-lg border-b-2 min-w-[80px] font-bold ${
              submitted && selected === exercise.correct
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : submitted && selected !== exercise.correct
                ? 'border-red-400 text-red-300 bg-red-500/10'
                : selected
                ? 'border-violet-400 text-violet-300 bg-violet-500/10'
                : 'border-white/30 text-white/40'
            }`}
          >
            {selected ?? '?'}
          </span>
          {parts[1]}
        </p>
      </div>

      {exercise.hint && (
        <p className="text-sm text-white/40 text-center italic">Gợi ý: {exercise.hint}</p>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {exercise.options?.map((option, i) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => !submitted && setSelected(option)}
            className={`p-4 rounded-2xl border-2 font-semibold text-base transition-all duration-200 flex items-center justify-between ${getStyle(option)}`}
          >
            <span>{option}</span>
            <AnimatePresence>
              {submitted && option === exercise.correct && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </motion.span>
              )}
              {submitted && option === selected && option !== exercise.correct && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <XCircle className="w-4 h-4 text-red-400" />
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
        className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Kiểm tra
      </motion.button>
    </div>
  );
}
