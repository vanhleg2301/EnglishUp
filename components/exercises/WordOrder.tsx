'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import type { Exercise } from '@/types';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}

export default function WordOrder({ exercise, onComplete }: Props) {
  const [available, setAvailable] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const shuffled = [...(exercise.words ?? [])].sort(() => Math.random() - 0.5);
    setAvailable(shuffled);
    setSelected([]);
    setSubmitted(false);
  }, [exercise]);

  const addWord = (word: string, index: number) => {
    if (submitted) return;
    setSelected((s) => [...s, word]);
    setAvailable((a) => a.filter((_, i) => i !== index));
  };

  const removeWord = (word: string, index: number) => {
    if (submitted) return;
    setAvailable((a) => [...a, word]);
    setSelected((s) => s.filter((_, i) => i !== index));
  };

  const reset = () => {
    const shuffled = [...(exercise.words ?? [])].sort(() => Math.random() - 0.5);
    setAvailable(shuffled);
    setSelected([]);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    const answer = selected.join(' ');
    const correct = answer === exercise.correct;
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onComplete(correct), 1400);
  };

  return (
    <div className="space-y-6">
      <p className="text-xl font-semibold text-white text-center">{exercise.question}</p>

      {/* Answer area */}
      <div className="min-h-[60px] p-4 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-wrap gap-2 items-center">
        <AnimatePresence>
          {selected.length === 0 && (
            <p className="text-white/30 text-sm italic w-full text-center">Nhấp vào các từ bên dưới</p>
          )}
          {selected.map((word, i) => (
            <motion.button
              key={`sel-${word}-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => removeWord(word, i)}
              className={`px-3 py-1.5 rounded-xl font-semibold text-sm border-2 transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-red-500 bg-red-500/20 text-red-300'
                  : 'border-violet-500 bg-violet-500/20 text-white hover:bg-violet-500/30'
              }`}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {available.map((word, i) => (
            <motion.button
              key={`avail-${word}-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => addWord(word, i)}
              className="px-4 py-2 rounded-xl font-semibold text-sm border-2 border-white/20 bg-white/10 text-white hover:border-violet-400 hover:bg-violet-500/20 transition-all"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 rounded-xl ${isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}
        >
          {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {!isCorrect && <span className="text-sm">Đáp án đúng: <strong>{exercise.correct}</strong></span>}
          {isCorrect && <span className="text-sm font-bold">Chính xác!</span>}
        </motion.div>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="p-3 rounded-xl border-2 border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={selected.length === 0 || submitted}
          className="flex-1 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Kiểm tra
        </motion.button>
      </div>
    </div>
  );
}
