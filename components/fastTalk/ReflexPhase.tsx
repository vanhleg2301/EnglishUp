'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Timer, Volume2, ChevronRight, Check, X, RotateCcw } from 'lucide-react';
import type { FastTalkUnit, FTDrill } from '@/lib/fastTalk';
import {
  useLinePlayer, useScoredRecorder, useMicSupported, MicButton, AttemptResult,
  PASS_SCORE, NATURAL_RATE, type Attempt,
} from './shared';

interface ReflexItem extends FTDrill {
  frame?: string;
}

type Status = 'prompt' | 'result';

export default function ReflexPhase({ unit, onDone }: { unit: FastTalkUnit; onDone: (firstTryPct: number) => void }) {
  const items: ReflexItem[] = useMemo(
    () => [...unit.drills, ...unit.pattern.slots.map((s) => ({ ...s, frame: unit.pattern.frame }))],
    [unit],
  );
  // Shorter thinking time at B1: the point is to stop translating word by word.
  const seconds = unit.level === 'B1' ? 5 : 7;

  const [queue, setQueue] = useState<number[]>(() => items.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState<Status>('prompt');
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [timerOn, setTimerOn] = useState(true);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const [requeued, setRequeued] = useState<Set<number>>(new Set());

  const idx = queue[pos];
  const item = items[idx];
  const targets = useMemo(() => [item.en, ...(item.accept ?? [])], [item]);
  const { recording, attempt, toggle, reset } = useScoredRecorder(targets);
  const micSupported = useMicSupported();
  const { play, stop } = useLinePlayer();

  const recordFirstTry = useCallback((passed: boolean) => {
    setFirstTry((prev) => (idx in prev ? prev : { ...prev, [idx]: passed }));
  }, [idx]);

  const reveal = useCallback(() => {
    setStatus('result');
    play([item.en], { rate: NATURAL_RATE });
  }, [item, play]);

  // Countdown — runs only while the prompt is showing and the user hasn't started speaking.
  useEffect(() => {
    if (status !== 'prompt' || !timerOn) return;
    const t = setTimeout(() => {
      if (timeLeft > 0.1) {
        setTimeLeft(+(timeLeft - 0.1).toFixed(1));
        return;
      }
      setTimeLeft(0);
      if (micSupported) recordFirstTry(false);
      reveal();
    }, 100);
    return () => clearTimeout(t);
  }, [status, timerOn, timeLeft, micSupported, recordFirstTry, reveal]);

  const handleMicPrompt = () => {
    setTimerOn(false);
    toggle((a: Attempt) => {
      recordFirstTry(a.score >= PASS_SCORE);
      reveal();
    });
  };

  const goNext = (selfRating?: boolean) => {
    if (selfRating !== undefined) recordFirstTry(selfRating);
    const failed = selfRating === false || (selfRating === undefined && (attempt?.score ?? 0) < PASS_SCORE);
    let nextQueue = queue;
    // Missed items come back once at the end of the round.
    if (failed && !requeued.has(idx)) {
      nextQueue = [...queue, idx];
      setQueue(nextQueue);
      setRequeued((prev) => new Set(prev).add(idx));
    }
    stop();
    reset();
    if (pos + 1 >= nextQueue.length) {
      const results = { ...firstTry };
      if (selfRating !== undefined && !(idx in results)) results[idx] = selfRating;
      const passed = Object.values(results).filter(Boolean).length;
      onDone(Math.round((passed / items.length) * 100));
      return;
    }
    setPos(pos + 1);
    setStatus('prompt');
    setTimeLeft(seconds);
    setTimerOn(true);
  };

  const passed = attempt !== null && attempt.score >= PASS_SCORE;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">3. Luyện phản xạ</h2>
        <p className="text-white/40 text-sm mt-0.5">
          Đọc câu tiếng Việt, nói ngay câu tiếng Anh trong {seconds} giây. Đừng dịch từng chữ, hãy lấy nguyên cụm đã học.
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-white/30 mb-3">
        <span>Câu {pos + 1} / {queue.length}</span>
        <span>{Object.values(firstTry).filter(Boolean).length} đúng ngay lần đầu</span>
      </div>

      <div className="p-5 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.10] to-cyan-500/[0.05] mb-4">
        {item.frame && (
          <p className="text-[11px] font-mono text-cyan-200/80 mb-2">Khung câu: {item.frame}</p>
        )}
        <p className="text-xl font-bold text-white leading-snug">{item.vi}</p>

        {status === 'prompt' && (
          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-100 ${timeLeft < 2 ? 'bg-red-400' : 'bg-violet-400'}`}
                style={{ width: `${(timeLeft / seconds) * 100}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-1.5 flex items-center gap-1">
              <Timer className="w-3 h-3" /> {timerOn ? `${Math.ceil(timeLeft)} giây` : 'Đang chấm…'}
            </p>
          </div>
        )}

        {status === 'result' && (
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between gap-2">
              <p className="text-lg font-black text-emerald-200">{item.en}</p>
              <button
                onClick={() => play([item.en], { rate: NATURAL_RATE })}
                className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 flex-shrink-0"
                aria-label="Nghe đáp án"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {item.accept && item.accept.length > 0 && (
              <p className="text-xs text-white/35 mt-1">Cũng đúng: {item.accept.join(' · ')}</p>
            )}
            {!attempt && micSupported && <p className="text-xs text-amber-300/80 mt-2">Hết giờ! Nghe đáp án, nói lại thật tự nhiên.</p>}
          </div>
        )}
      </div>

      {attempt && <div className="mb-4"><AttemptResult attempt={attempt} /></div>}

      {status === 'prompt' && (
        micSupported ? (
          <div className="flex flex-col gap-2">
            <MicButton recording={recording} onClick={handleMicPrompt} label="Bấm và nói" />
            <button onClick={() => { if (recording) toggle(); recordFirstTry(false); reveal(); }} className="text-xs text-white/30 hover:text-white/60 py-2">
              Mình chịu, xem đáp án
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-white/40 text-center">Trình duyệt này không nhận giọng nói. Hãy nói to câu trả lời rồi bấm xem đáp án.</p>
            <button onClick={() => { setTimerOn(false); reveal(); }} className="py-3 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-200 font-semibold text-sm">
              Xem đáp án
            </button>
          </div>
        )
      )}

      {status === 'result' && (
        micSupported ? (
          <div className="flex gap-2">
            {!passed && (
              <MicButton recording={recording} onClick={() => toggle()} label="Nói lại" />
            )}
            <button
              onClick={() => goNext()}
              className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.09]"
            >
              {passed ? <>Tiếp <ChevronRight className="w-4 h-4" /></> : <><RotateCcw className="w-4 h-4" /> Bỏ qua, ôn lại sau</>}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => goNext(false)} className="flex-1 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-semibold text-sm flex items-center justify-center gap-1.5">
              <X className="w-4 h-4" /> Chưa đúng
            </button>
            <button onClick={() => goNext(true)} className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 font-semibold text-sm flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" /> Mình nói đúng
            </button>
          </div>
        )
      )}
    </div>
  );
}
