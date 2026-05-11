'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, RotateCcw, ChevronRight } from 'lucide-react';
import { useTTS, useSpeechRecognition, scorePronunciation } from '@/hooks/useSpeech';
import type { Exercise } from '@/types';

interface Props {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
}

type Status = 'idle' | 'listening' | 'result';

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
  const label = score >= 80 ? 'Tuyệt vời!' : score >= 50 ? 'Khá tốt!' : 'Cần luyện thêm';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="text-3xl font-black"
            style={{ color }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <p className="font-semibold" style={{ color }}>{label}</p>
    </div>
  );
}

export default function PronunciationCheck({ exercise, onComplete }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [heard, setHeard] = useState('');
  const [result, setResult] = useState<{ results: { word: string; matched: boolean }[]; score: number } | null>(null);
  const [attempts, setAttempts] = useState(0);

  const { speak } = useTTS();
  const { startListening, stopListening } = useSpeechRecognition();

  const phrase = exercise.audioText ?? exercise.correct;
  const phonetic = exercise.hint ?? '';

  const handleListen = () => speak(phrase, 0.75);

  const handleRecord = () => {
    if (status === 'listening') {
      stopListening();
      setStatus('idle');
      return;
    }
    setStatus('listening');
    setHeard('');
    setResult(null);

    startListening(
      (transcript) => {
        setHeard(transcript);
        const scored = scorePronunciation(phrase, transcript);
        setResult(scored);
        setStatus('result');
        setAttempts((a) => a + 1);
      },
      () => {
        setStatus((s) => s === 'listening' ? 'idle' : s);
      }
    );
  };

  const handleRetry = () => {
    setStatus('idle');
    setHeard('');
    setResult(null);
  };

  const handleContinue = () => {
    onComplete((result?.score ?? 0) >= 50);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <p className="text-white/50 text-sm uppercase tracking-wider font-semibold">Luyện phát âm</p>
        <p className="text-xl font-semibold text-white">{exercise.question}</p>
      </div>

      {/* Phrase card */}
      <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 text-center space-y-3">
        <p className="text-3xl font-bold text-white leading-snug">{phrase}</p>
        {phonetic && (
          <p className="text-violet-300 text-base font-mono">{phonetic}</p>
        )}
        <button
          onClick={handleListen}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          Nghe giọng chuẩn
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status !== 'result' ? (
          <motion.div key="record" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Mic button */}
            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleRecord}
                className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  status === 'listening'
                    ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-red-500/40'
                    : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/30'
                }`}
              >
                {status === 'listening' && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 rounded-full bg-red-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
                      className="absolute inset-0 rounded-full bg-red-300"
                    />
                  </>
                )}
                {status === 'listening'
                  ? <MicOff className="w-12 h-12 text-white relative z-10" />
                  : <Mic className="w-12 h-12 text-white relative z-10" />
                }
              </motion.button>
            </div>

            <p className="text-center text-white/40 text-sm">
              {status === 'idle'
                ? attempts > 0 ? 'Nhấp để thử lại' : 'Nhấp vào micro và nói câu trên'
                : 'Đang nghe... nói to và rõ ràng'}
            </p>

            <p className="text-center text-xs text-white/20">
              Mẹo: Nói chậm, rõ từng từ — đặc biệt chú ý các âm cuối
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Score ring */}
            <div className="flex justify-center">
              <ScoreRing score={result!.score} />
            </div>

            {/* Word-by-word breakdown */}
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4 space-y-3">
              <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Phân tích từng từ</p>
              <div className="flex flex-wrap gap-2">
                {result!.results.map((r, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-sm border ${
                      r.matched
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/20 border-red-500/40 text-red-300'
                    }`}
                  >
                    {r.matched ? '✓' : '✗'} {r.word}
                  </motion.span>
                ))}
              </div>

              {heard && (
                <div className="pt-2 border-t border-white/5">
                  <p className="text-white/30 text-xs">Hệ thống nghe được:</p>
                  <p className="text-white/60 text-sm italic mt-0.5">"{heard}"</p>
                </div>
              )}
            </div>

            {/* Pronunciation tips for failed words */}
            {result!.score < 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/70 space-y-1"
              >
                <p className="font-semibold text-amber-300">Lời khuyên:</p>
                <p>• Nghe lại giọng mẫu, chú ý trọng âm (âm nhấn)</p>
                <p>• Nói chậm hơn, từng âm tiết rõ ràng</p>
                <p>• Đảm bảo phát âm đủ âm cuối (-t, -d, -s, -th)</p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-4 rounded-2xl border-2 border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Thử lại
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
              >
                Tiếp tục
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
