'use client';

import { Fragment, useMemo, useState } from 'react';
import { Play, Square, Volume2, Languages, ChevronRight, Check, X } from 'lucide-react';
import type { A1Day, A1Word } from '@/lib/a1';
import { useLinePlayer, SpeedToggle, NextButton, SLOW_RATE } from '@/components/fastTalk/shared';

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Splits a sentence into plain text and the day's words, so new words can be tapped. */
function useWordMatcher(words: A1Word[]) {
  return useMemo(() => {
    const lookup = new Map<string, A1Word>();
    for (const w of words) {
      for (const term of [w.word, ...(w.forms ?? [])]) lookup.set(term.toLowerCase(), w);
    }
    const terms = [...lookup.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
    const re = new RegExp(`(?<![A-Za-z])(${terms.join('|')})(?![A-Za-z])`, 'gi');
    return (sentence: string) =>
      sentence.split(re).map((part, k) => ({ text: part, word: k % 2 === 1 ? lookup.get(part.toLowerCase()) : undefined }));
  }, [words]);
}

export default function StoryPhase({ day, onNext }: { day: A1Day; onNext: () => void }) {
  const { play, stop, playing } = useLinePlayer();
  const [rate, setRate] = useState(SLOW_RATE);
  const sentences = day.story.sentences;
  const texts = useMemo(() => sentences.map((s) => s.en), [sentences]);
  const [shownVi, setShownVi] = useState<Set<number>>(new Set());
  const [gloss, setGloss] = useState<A1Word | null>(null);
  // `playing` is an index into whichever list was played last; only highlight story lines for the story.
  const [source, setSource] = useState<'story' | 'other'>('story');
  const playStory = (from?: number, to?: number) => { setSource('story'); play(texts, { rate, from, to }); };
  const playOther = (list: string[], from?: number, to?: number, r = rate) => { setSource('other'); play(list, { rate: r, from, to }); };
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => day.story.questions.map(() => null));
  const split = useWordMatcher(day.words);

  const questionTexts = useMemo(() => day.story.questions.map((q) => q.q), [day]);
  const correct = answers.filter((a, k) => a === day.story.questions[k].answer).length;
  const allAnswered = answers.every((a) => a !== null);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">2. Nghe câu chuyện</h2>
        <p className="text-white/40 text-sm mt-0.5">
          Nghe và nhìn theo chữ. Từ <span className="text-emerald-300 font-semibold">màu xanh</span> là từ mới, bấm để xem nghĩa. Nghe 2–3 lần cho tới khi hiểu hết.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {playing !== null && source === 'story' ? (
          <button onClick={stop} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-semibold">
            <Square className="w-3.5 h-3.5" /> Dừng
          </button>
        ) : (
          <button onClick={() => playStory()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 text-sm font-semibold">
            <Play className="w-3.5 h-3.5" /> Nghe cả truyện
          </button>
        )}
        <SpeedToggle rate={rate} onChange={setRate} />
      </div>

      {gloss && (
        <div className="sticky top-14 z-10 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d1a17] border border-emerald-500/30">
          <span className="text-xl">{gloss.emoji}</span>
          <span className="text-sm text-white font-bold">{gloss.word}</span>
          <span className="text-sm text-emerald-200">= {gloss.vi}</span>
          <button onClick={() => setGloss(null)} className="ml-auto text-white/40 hover:text-white/80" aria-label="Đóng">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] mb-6">
        <p className="text-xs uppercase tracking-wider text-white/30 font-bold mb-3">{day.story.title}</p>
        <div className="space-y-1">
          {sentences.map((s, k) => (
            <div key={k} className={`group rounded-lg px-2 py-1.5 -mx-2 transition-colors ${source === 'story' && playing === k ? 'bg-emerald-500/10' : ''}`}>
              <div className="flex items-start gap-2">
                <p className="flex-1 text-[17px] leading-relaxed text-white/90">
                  {split(s.en).map((part, p) =>
                    part.word ? (
                      <button
                        key={p}
                        onClick={() => { setGloss(part.word!); playOther([part.word!.word], undefined, undefined, SLOW_RATE); }}
                        className="text-emerald-300 font-semibold underline decoration-emerald-400/40 decoration-dotted underline-offset-4"
                      >
                        {part.text}
                      </button>
                    ) : (
                      <Fragment key={p}>{part.text}</Fragment>
                    ),
                  )}
                </p>
                <button
                  onClick={() => playStory(k, k + 1)}
                  className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/30 hover:text-white/70 flex-shrink-0"
                  aria-label="Nghe câu này"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShownVi((prev) => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; })}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${shownVi.has(k) ? 'bg-white/[0.12] text-white/80' : 'bg-white/[0.05] text-white/30 hover:text-white/70'}`}
                  aria-label="Dịch câu này"
                >
                  <Languages className="w-3.5 h-3.5" />
                </button>
              </div>
              {shownVi.has(k) && <p className="text-sm text-white/40 italic mt-0.5">{s.vi}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-bold text-white">Nghe câu hỏi, trả lời Yes hoặc No</p>
        <p className="text-xs text-white/35">Bấm loa để nghe câu hỏi. Cố hiểu bằng tai trước khi đọc.</p>
      </div>
      <div className="space-y-2 mb-4">
        {day.story.questions.map((q, k) => {
          const a = answers[k];
          const right = a !== null && a === q.answer;
          return (
            <div key={k} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playOther(questionTexts, k, k + 1)}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white flex-shrink-0"
                  aria-label="Nghe câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <p className="flex-1 text-sm text-white/90">{q.q}</p>
              </div>
              {a === null ? (
                <div className="flex gap-2 mt-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => setAnswers((prev) => prev.map((x, j) => (j === k ? v : x)))}
                      className="flex-1 py-2 rounded-lg border border-white/[0.10] text-sm font-semibold text-white/70 hover:bg-white/[0.06]"
                    >
                      {v ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={`mt-2 text-sm font-semibold flex items-center gap-1.5 ${right ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {right ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {q.answer ? 'Yes' : 'No'}{right ? ', đúng rồi!' : ' mới đúng.'}
                  <span className="text-white/35 font-normal ml-1">({q.vi})</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <p className="text-sm text-white/50 mb-4">
          Đúng {correct}/{day.story.questions.length}.{' '}
          {correct < day.story.questions.length ? 'Nghe lại câu chuyện một lần nữa nhé.' : 'Bạn đã hiểu câu chuyện!'}
        </p>
      )}

      <NextButton onClick={() => { stop(); onNext(); }}>
        Tiếp: Hội thoại <ChevronRight className="w-4 h-4" />
      </NextButton>
    </div>
  );
}
