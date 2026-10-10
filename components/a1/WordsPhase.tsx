'use client';

import { useEffect, useState } from 'react';
import { Volume2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { A1Day } from '@/lib/a1';
import { useLinePlayer, NextButton, SLOW_RATE } from '@/components/fastTalk/shared';

/**
 * Comprehensible-input vocab: picture + simple sentences first, the learner
 * guesses the meaning, and Vietnamese is only a tap away for checking.
 */
export default function WordsPhase({ day, onNext }: { day: A1Day; onNext: () => void }) {
  const { play, stop, playing } = useLinePlayer();
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const w = day.words[i];
  const texts = [w.word, ...w.examples];

  // Hear the word and its examples whenever a new card shows.
  useEffect(() => {
    play([w.word, ...w.examples], { rate: SLOW_RATE });
  }, [w, play]);

  const isRevealed = revealed.has(i);
  const last = i === day.words.length - 1;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">1. Từ mới qua ngữ cảnh</h2>
        <p className="text-white/40 text-sm mt-0.5">Nhìn hình, nghe câu, tự đoán nghĩa trước. Chỉ bấm xem nghĩa để kiểm tra.</p>
      </div>

      <div className="flex gap-1 mb-4">
        {day.words.map((_, k) => (
          <div key={k} className={`h-1 flex-1 rounded-full ${k < i ? 'bg-emerald-400/60' : k === i ? 'bg-emerald-400' : 'bg-white/[0.08]'}`} />
        ))}
      </div>

      <div className="p-6 rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.10] to-cyan-500/[0.05] text-center mb-4">
        <div className="text-6xl mb-3" aria-hidden>{w.emoji}</div>
        <div className="flex items-center justify-center gap-2">
          <p className="text-3xl font-black text-white">{w.word}</p>
          <button
            onClick={() => play(texts, { rate: SLOW_RATE, to: 1 })}
            className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center text-white/60 hover:text-white"
            aria-label="Nghe từ"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-2 text-left">
          {w.examples.map((ex, k) => (
            <button
              key={k}
              onClick={() => play(texts, { rate: SLOW_RATE, from: k + 1, to: k + 2 })}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                playing === k + 1 ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <span className="text-base text-white/90">{ex}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[44px]">
          {isRevealed ? (
            <p className="text-lg font-bold text-emerald-200">= {w.vi}</p>
          ) : (
            <button
              onClick={() => setRevealed((prev) => new Set(prev).add(i))}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-white/[0.15] text-white/50 text-sm hover:text-white/80"
            >
              <Eye className="w-4 h-4" /> Đoán xong? Xem nghĩa
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {i > 0 && (
          <button
            onClick={() => setI(i - 1)}
            className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50"
            aria-label="Từ trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {last ? (
          <div className="flex-1">
            <NextButton onClick={() => { stop(); onNext(); }}>
              Tiếp: Nghe câu chuyện <ChevronRight className="w-4 h-4" />
            </NextButton>
          </div>
        ) : (
          <button
            onClick={() => setI(i + 1)}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.09]"
          >
            Từ tiếp theo ({i + 2}/{day.words.length}) <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
