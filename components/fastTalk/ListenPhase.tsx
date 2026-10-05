'use client';

import { useMemo, useState } from 'react';
import { Play, Square, Eye, Volume2, ChevronRight, Lightbulb } from 'lucide-react';
import type { FastTalkUnit } from '@/lib/fastTalk';
import { useLinePlayer, SpeedToggle, NextButton, NATURAL_RATE } from './shared';

export default function ListenPhase({ unit, onNext }: { unit: FastTalkUnit; onNext: () => void }) {
  const { play, stop, playing } = useLinePlayer();
  const [rate, setRate] = useState(NATURAL_RATE);
  const [answers, setAnswers] = useState<(number | null)[]>(() => unit.questions.map(() => null));
  const [showText, setShowText] = useState(false);
  const [showVi, setShowVi] = useState(false);

  const texts = useMemo(() => unit.dialogue.map((l) => l.text), [unit]);
  // Alternate pitch per speaker so two voices are easier to tell apart.
  const pitches = useMemo(() => {
    const speakers = [...new Set(unit.dialogue.map((l) => l.speaker))];
    return unit.dialogue.map((l) => (speakers.indexOf(l.speaker) % 2 === 0 ? 1.1 : 0.8));
  }, [unit]);

  const allAnswered = answers.every((a) => a !== null);
  const correct = answers.filter((a, i) => a === unit.questions[i].answer).length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">1. Nghe hiểu</h2>
        <p className="text-white/40 text-sm mt-0.5">Nghe trước, chưa nhìn chữ. Trả lời câu hỏi rồi mới xem lời thoại.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {playing !== null ? (
          <button onClick={stop} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-semibold">
            <Square className="w-3.5 h-3.5" /> Dừng
          </button>
        ) : (
          <button onClick={() => play(texts, { rate, pitches })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-200 text-sm font-semibold hover:bg-violet-500/30">
            <Play className="w-3.5 h-3.5" /> Nghe hội thoại
          </button>
        )}
        <SpeedToggle rate={rate} onChange={setRate} />
      </div>

      {/* Comprehension questions */}
      <div className="space-y-3 mb-5">
        {unit.questions.map((q, qi) => (
          <div key={qi} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <p className="text-sm font-semibold text-white mb-2.5">{q.q}</p>
            <div className="grid gap-1.5">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi;
                const answered = answers[qi] !== null;
                const isRight = oi === q.answer;
                return (
                  <button
                    key={oi}
                    disabled={answered}
                    onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                    className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                      answered && isRight
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                        : chosen
                        ? 'border-red-500/40 bg-red-500/10 text-red-200'
                        : 'border-white/[0.07] text-white/60 hover:bg-white/[0.05]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {allAnswered && (
        <p className="text-sm text-white/50 mb-4">
          Bạn đúng <span className="font-bold text-white">{correct}/{unit.questions.length}</span>.{' '}
          {correct < unit.questions.length ? 'Nghe lại một lần nữa trong khi đọc lời thoại.' : 'Nghe tốt lắm!'}
        </p>
      )}

      {!showText ? (
        <button
          onClick={() => setShowText(true)}
          className="w-full mb-6 py-3 rounded-xl border border-dashed border-white/[0.12] text-white/50 text-sm font-semibold flex items-center justify-center gap-2 hover:text-white/80"
        >
          <Eye className="w-4 h-4" /> {allAnswered ? 'Xem lời thoại' : 'Xem lời thoại (nên trả lời trước)'}
        </button>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wider text-white/30 font-bold">Lời thoại</p>
            <button onClick={() => setShowVi(!showVi)} className="text-xs text-white/40 hover:text-white/70">
              {showVi ? 'Ẩn' : 'Hiện'} tiếng Việt
            </button>
          </div>
          <div className="space-y-2 mb-6">
            {unit.dialogue.map((line, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border transition-all ${playing === i ? 'border-violet-500/40 bg-violet-500/[0.08]' : 'border-white/[0.06] bg-white/[0.02]'}`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${line.speaker === 'You' ? 'text-violet-300' : 'text-cyan-300'}`}>{line.speaker}</p>
                    <p className="text-sm text-white leading-relaxed">{line.text}</p>
                    {showVi && <p className="text-xs text-white/40 mt-1 italic">{line.vi}</p>}
                  </div>
                  <button
                    onClick={() => play(texts, { rate, from: i, to: i + 1, pitches })}
                    className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/70 flex-shrink-0"
                    aria-label="Nghe câu này"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-white/30 font-bold mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" /> Người bản xứ nói nhanh thế nào
            </p>
            <div className="space-y-2">
              {unit.connectedSpeech.map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/20">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-white font-semibold">
                      {c.written} <span className="text-amber-200/80 font-mono text-xs ml-1">{c.spoken}</span>
                    </p>
                    <button
                      onClick={() => play([c.written], { rate: NATURAL_RATE })}
                      className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/70 flex-shrink-0"
                      aria-label="Nghe"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-white/50 mt-1">{c.note}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <NextButton onClick={() => { stop(); onNext(); }}>
        Tiếp: Học cụm từ <ChevronRight className="w-4 h-4" />
      </NextButton>
    </div>
  );
}
