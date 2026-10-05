'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Mic, MicOff } from 'lucide-react';
import {
  pickFemaleVoice, scorePronunciation, isSpeechRecognitionSupported, useSpeechRecognition,
  type PronunciationResult,
} from '@/hooks/useSpeech';

export const PASS_SCORE = 70;
export const NATURAL_RATE = 1.0;
export const SLOW_RATE = 0.78;

export interface Attempt {
  heard: string;
  score: number;
  words: PronunciationResult[];
}

/** Score `heard` against the main answer and any accepted alternatives; keep the best. */
export function scoreAgainst(targets: string[], heard: string): Attempt {
  let best: Attempt = { heard, score: -1, words: [] };
  for (const t of targets) {
    const { results, score } = scorePronunciation(t, heard);
    if (score > best.score) best = { heard, score, words: results };
  }
  return best;
}

const subscribeNoop = () => () => {};

/** Speech recognition support is only known on the client; the server snapshot avoids a hydration mismatch. */
export function useMicSupported(): boolean {
  return useSyncExternalStore(subscribeNoop, isSpeechRecognitionSupported, () => false);
}

/**
 * Plays a list of lines with TTS, tracking which absolute index is playing.
 * A token guards against stale `onend` callbacks after stop()/replay.
 */
export function useLinePlayer() {
  const tokenRef = useRef(0);
  const [playing, setPlaying] = useState<number | null>(null);

  const stop = useCallback(() => {
    tokenRef.current++;
    setPlaying(null);
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }, []);

  const play = useCallback((
    texts: string[],
    opts: { rate: number; from?: number; to?: number; pitches?: number[]; onDone?: () => void },
  ) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const token = ++tokenRef.current;
    window.speechSynthesis.cancel();
    const voice = pickFemaleVoice();
    const end = opts.to ?? texts.length;
    let i = opts.from ?? 0;
    const next = () => {
      if (tokenRef.current !== token) return;
      if (i >= end) {
        setPlaying(null);
        opts.onDone?.();
        return;
      }
      setPlaying(i);
      const u = new SpeechSynthesisUtterance(texts[i]);
      u.lang = 'en-US';
      u.rate = opts.rate;
      u.pitch = opts.pitches?.[i] ?? 1;
      if (voice) u.voice = voice;
      u.onend = () => { i++; setTimeout(next, 300); };
      u.onerror = () => { if (tokenRef.current === token) setPlaying(null); };
      window.speechSynthesis.speak(u);
    };
    next();
  }, []);

  useEffect(() => stop, [stop]);

  return { play, stop, playing };
}

/** Records once and scores against the targets. */
export function useScoredRecorder(targets: string[]) {
  const { startListening, stopListening } = useSpeechRecognition();
  const [recording, setRecording] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const toggle = useCallback((onScored?: (a: Attempt) => void) => {
    if (recording) {
      stopListening();
      setRecording(false);
      return;
    }
    setAttempt(null);
    setRecording(true);
    startListening(
      (heard) => {
        const a = scoreAgainst(targets, heard);
        setAttempt(a);
        setRecording(false);
        onScored?.(a);
      },
      () => setRecording(false),
    );
  }, [recording, startListening, stopListening, targets]);

  const reset = useCallback(() => {
    stopListening();
    setRecording(false);
    setAttempt(null);
  }, [stopListening]);

  return { recording, attempt, toggle, reset };
}

export function MicButton({ recording, onClick, label = 'Nói' }: { recording: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
        recording
          ? 'bg-red-500/20 border border-red-500/40 text-red-300 animate-pulse'
          : 'bg-violet-500/20 border border-violet-500/40 text-violet-200 hover:bg-violet-500/30'
      }`}
    >
      {recording ? <><MicOff className="w-4 h-4" /> Đang nghe…</> : <><Mic className="w-4 h-4" /> {label}</>}
    </button>
  );
}

export function AttemptResult({ attempt }: { attempt: Attempt }) {
  const passed = attempt.score >= PASS_SCORE;
  return (
    <div className={`p-3 rounded-xl border ${passed ? 'border-emerald-500/30 bg-emerald-500/[0.07]' : 'border-amber-500/30 bg-amber-500/[0.07]'}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-bold ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>
          {passed ? 'Tốt lắm!' : 'Gần đúng rồi'}
        </span>
        <span className={`text-sm font-black ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>{attempt.score}%</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {attempt.words.map((w, i) => (
          <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${w.matched ? 'text-emerald-200 bg-emerald-500/10' : 'text-red-300 bg-red-500/10 line-through decoration-red-400/50'}`}>
            {w.word}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-white/30 mt-1.5">Bạn nói: “{attempt.heard}”</p>
    </div>
  );
}

export function SpeedToggle({ rate, onChange }: { rate: number; onChange: (r: number) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-0.5 text-xs font-semibold">
      {[{ r: NATURAL_RATE, label: 'Tốc độ thật' }, { r: SLOW_RATE, label: 'Chậm' }].map(({ r, label }) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 rounded-lg transition-colors ${rate === r ? 'bg-white/[0.10] text-white' : 'text-white/40 hover:text-white/70'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function NextButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.09] transition-colors"
    >
      {children}
    </button>
  );
}
