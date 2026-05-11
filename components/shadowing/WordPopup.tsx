'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, BookOpen } from 'lucide-react';
import { useTTS } from '@/hooks/useSpeech';
import { lookupWord } from '@/lib/wordExamples';

interface Props {
  word: string;
  onClose: () => void;
}

function highlight(sentence: string, target: string) {
  const regex = new RegExp(`(${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = sentence.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-violet-500/30 text-violet-200 rounded px-0.5 not-italic">{part}</mark>
      : <span key={i}>{part}</span>
  );
}

export default function WordPopup({ word, onClose }: Props) {
  const { speak } = useTTS();
  const entry = lookupWord(word);
  const clean = word.replace(/[^a-zA-Z]/g, '');

  useEffect(() => {
    speak(clean, 0.75);
  }, [clean, speak]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 50, scale: 0.96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-3xl bg-[#0f0f1e] border border-white/10 shadow-2xl shadow-black/50 mb-4 sm:mb-0 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-black text-white tracking-tight">{clean}</h2>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => speak(clean, 0.75)}
                    className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 transition-all flex-shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </motion.button>
                </div>
                {entry ? (
                  <>
                    <p className="text-violet-300 font-mono text-sm mt-1">{entry.phonetic}</p>
                    <p className="text-white/60 text-sm mt-1">{entry.definition}</p>
                  </>
                ) : (
                  <p className="text-white/40 text-sm mt-1 italic">Nhấp loa để nghe phát âm chuẩn</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Examples */}
          <div className="p-6 pt-4 space-y-3 max-h-[55vh] overflow-y-auto">
            {entry ? (
              <>
                <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  Ví dụ sử dụng
                </div>
                {entry.examples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group relative p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-white/15 transition-all"
                  >
                    <button
                      onClick={() => speak(ex.sentence, 0.8)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-white/10 text-white/50 hover:text-cyan-300 transition-all"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <p className="text-white/90 text-sm leading-relaxed pr-8">
                      {highlight(ex.sentence, clean)}
                    </p>
                    <p className="text-white/40 text-xs mt-1.5 italic">{ex.translation}</p>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white/20" />
                </div>
                <p className="text-white/30 text-sm">Từ này chưa có trong từ điển.</p>
                <p className="text-white/20 text-xs">Hãy nghe phát âm và dùng trong ngữ cảnh câu.</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speak(clean, 0.7)}
                  className="mx-auto flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  Nghe phát âm
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
