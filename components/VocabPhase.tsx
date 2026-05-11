'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronRight, ChevronLeft, Mic } from 'lucide-react';
import { useTTS } from '@/hooks/useSpeech';
import PronunciationPanel from '@/components/PronunciationPanel';
import type { VocabItem } from '@/types';

interface Props {
  vocab: VocabItem[];
  onDone: () => void;
}

export default function VocabPhase({ vocab, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [practiceWord, setPracticeWord] = useState<VocabItem | null>(null);
  const { speak } = useTTS();
  const current = vocab[index];

  const goNext = () => {
    if (index < vocab.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-white/50 text-sm">Từ vựng hôm nay</p>
          <div className="flex gap-1.5">
            {vocab.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-violet-400' : i < index ? 'w-3 bg-violet-600' : 'w-3 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur p-8 text-center space-y-4 min-h-[300px] flex flex-col justify-center">
              {/* Word + TTS */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl md:text-5xl font-bold text-white">{current.word}</span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => speak(current.word)}
                  className="p-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Phonetic */}
              {current.phonetic && (
                <p className="text-violet-300 font-mono text-base">{current.phonetic}</p>
              )}

              {/* Translation */}
              <p className="text-2xl font-semibold text-white/80">{current.translation}</p>

              {/* Example */}
              <div className="mt-2 p-4 rounded-2xl bg-black/20 border border-white/5 text-left space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider mt-0.5 flex-shrink-0">Ví dụ</span>
                  <div>
                    <p className="text-white/90 text-sm">{current.example}</p>
                    <p className="text-white/40 text-xs mt-0.5">{current.exampleTranslation}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => speak(current.example, 0.78)}
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-cyan-300 transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe câu ví dụ
                </button>
                <span className="text-white/15">•</span>
                <button
                  onClick={() => setPracticeWord(current)}
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-violet-300 transition-all"
                >
                  <Mic className="w-3.5 h-3.5" />
                  Luyện phát âm
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="p-4 rounded-2xl border-2 border-white/10 text-white/40 hover:text-white/60 disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            className="flex-1 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center gap-2"
          >
            {index < vocab.length - 1 ? (
              <>Tiếp theo <ChevronRight className="w-5 h-5" /></>
            ) : (
              'Bắt đầu luyện tập!'
            )}
          </motion.button>
        </div>
      </div>

      {/* Pronunciation panel */}
      <AnimatePresence>
        {practiceWord && (
          <PronunciationPanel
            word={practiceWord.word}
            phonetic={practiceWord.phonetic}
            translation={practiceWord.translation}
            onClose={() => setPracticeWord(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
