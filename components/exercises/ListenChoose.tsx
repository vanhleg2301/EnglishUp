'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import { useTTS } from '@/hooks/useSpeech';
import type { Exercise } from '@/types';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}

export default function ListenChoose({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { speak } = useTTS();

  const handlePlay = () => {
    if (!exercise.audioText) return;
    setPlaying(true);
    speak(exercise.audioText, 0.8);
    setTimeout(() => setPlaying(false), (exercise.audioText.length / 10) * 1000 + 1000);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => onComplete(selected === exercise.correct), 1200);
  };

  const getStyle = (option: string) => {
    if (!submitted) {
      return selected === option
        ? 'border-violet-500 bg-violet-500/20 text-white'
        : 'border-white/10 bg-white/5 text-white/80 hover:border-violet-400 hover:bg-violet-500/10';
    }
    if (option === exercise.correct) return 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
    if (option === selected) return 'border-red-500 bg-red-500/20 text-red-300';
    return 'border-white/10 bg-white/5 text-white/30';
  };

  return (
    <div className="space-y-6">
      <p className="text-xl font-semibold text-white text-center">{exercise.question}</p>

      {/* Play button */}
      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handlePlay}
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
        >
          <motion.div
            animate={playing ? { scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] } : { scale: 1 }}
            transition={{ repeat: playing ? Infinity : 0, duration: 1 }}
            className="absolute inset-0 rounded-full bg-cyan-400"
          />
          <Volume2 className="w-10 h-10 text-white relative z-10" />
        </motion.button>
      </div>
      <p className="text-center text-white/40 text-sm">Nhấp để nghe, sau đó chọn câu đúng</p>

      <div className="grid grid-cols-1 gap-3">
        {exercise.options?.map((option, i) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => !submitted && setSelected(option)}
            className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all duration-200 flex items-center justify-between ${getStyle(option)}`}
          >
            <span className="text-sm">{option}</span>
            {submitted && option === exercise.correct && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            {submitted && option === selected && option !== exercise.correct && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={!selected || submitted}
        className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Kiểm tra
      </motion.button>
    </div>
  );
}
