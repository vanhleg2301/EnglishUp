'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Volume2, CheckCircle, XCircle, Zap, Clock } from 'lucide-react';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useProgress } from '@/hooks/useProgress';

const TYPE_LABELS = {
  'fill-blank': 'Fill in the Blank',
  'listen-choose': 'Listen & Answer',
  'choose-slang': 'Spot the Slang',
} as const;

function speakText(text: string, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.82;
  utter.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const pref = ['Google US English', 'Samantha', 'Zira', 'Karen', 'Eva'];
  let voice = voices.find((v) => pref.some((p) => v.name.includes(p))) ?? voices.find((v) => v.lang === 'en-US') ?? null;
  if (voice) utter.voice = voice;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

export default function DailyChallengePage() {
  const { challenge, isCompleted, todayHistory, streak, countdown, submitAnswer } = useDailyChallenge();
  const { addXP } = useProgress();
  const [selected, setSelected] = useState<string | null>(isCompleted ? (todayHistory?.selectedId ?? null) : null);
  const [revealed, setRevealed] = useState(isCompleted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [xpPopped, setXpPopped] = useState(false);
  const hasSubmitted = useRef(isCompleted);

  const handlePlay = useCallback(() => {
    if (!challenge.audioText) return;
    setIsPlaying(true);
    speakText(challenge.audioText, () => setIsPlaying(false));
  }, [challenge.audioText]);

  const handleSelect = useCallback((optId: string) => {
    if (revealed) return;
    setSelected(optId);
    const correct = submitAnswer(optId);
    setRevealed(true);
    if (correct && !hasSubmitted.current) {
      hasSubmitted.current = true;
      addXP(challenge.xpReward);
      setXpPopped(true);
      setTimeout(() => setXpPopped(false), 2000);
    }
  }, [revealed, submitAnswer, addXP, challenge.xpReward]);

  const isCorrect = selected === challenge.correctId;
  const hasAudio = Boolean(challenge.audioText);
  const isFillBlank = challenge.type === 'fill-blank';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/app">
            <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div className="flex-1">
            <p className="font-bold text-base leading-none">Daily Challenge</p>
            <p className="text-white/30 text-xs mt-0.5">{TYPE_LABELS[challenge.type]}</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-base">🔥</span>
              <span className="text-white/70 font-bold text-sm">{streak}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-16 pt-8">
        <div className="space-y-5">
          {/* Challenge card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/8 border border-white/12 text-white/50">
                {TYPE_LABELS[challenge.type]}
              </span>
              <span className="text-xs text-white/25 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {challenge.xpReward} XP
              </span>
            </div>

            <p className="text-white/50 text-sm">{challenge.instruction}</p>

            {/* Audio player */}
            {hasAudio && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/8">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlay}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                    isPlaying ? 'border-white/40 bg-white/10' : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/8'
                  }`}
                >
                  <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-white' : 'text-white/50'}`} />
                </motion.button>
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 text-xs mb-1">Tap to listen</p>
                  {revealed && challenge.audioText && (
                    <p className="text-white/25 text-xs italic truncate">"{challenge.audioText}"</p>
                  )}
                </div>
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-6 flex-shrink-0">
                    {[4, 7, 10, 7, 5, 9, 6, 4, 8, 5].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-white/40 rounded-full"
                        animate={{ scaleY: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.06 }}
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sentence with blank */}
            {isFillBlank && challenge.sentence && (
              <div className="rounded-2xl bg-white/4 border border-white/8 p-4">
                <p className="text-lg font-semibold leading-relaxed text-white/90">
                  {challenge.sentence.split('___').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={`inline-block min-w-[80px] border-b-2 mx-1.5 px-2 text-center font-bold transition-all ${
                          revealed ? 'border-white/60 text-white' : 'border-white/30 text-transparent'
                        }`}>
                          {revealed ? challenge.options.find((o) => o.id === challenge.correctId)?.text : '___'}
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Question */}
            <p className="text-white font-bold text-base leading-snug">{challenge.question}</p>

            {/* Options */}
            <div className="space-y-2.5">
              {challenge.options.map((opt) => {
                const isSelected = selected === opt.id;
                const isCorrectOpt = opt.id === challenge.correctId;

                let cls = 'border-white/10 bg-white/5 text-white/70 hover:border-white/22 hover:text-white cursor-pointer';
                if (revealed) {
                  if (isCorrectOpt) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 cursor-default';
                  else if (isSelected) cls = 'border-red-500/50 bg-red-500/10 text-red-300 cursor-default';
                  else cls = 'border-white/5 bg-white/[0.02] text-white/25 cursor-default';
                }

                return (
                  <motion.button
                    key={opt.id}
                    whileTap={!revealed ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(opt.id)}
                    disabled={revealed}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all flex items-center gap-3 ${cls}`}
                  >
                    <span className="w-6 h-6 rounded-lg border border-current opacity-60 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {revealed && isCorrectOpt && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                    {revealed && isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* XP pop */}
                <AnimatePresence>
                  {xpPopped && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 0.8 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0, y: -40 }}
                      className="fixed top-20 right-6 z-50 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-black text-sm font-bold shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      +{challenge.xpReward} XP
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Explanation */}
                <div className={`rounded-2xl p-5 border ${
                  isCorrect ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl flex-shrink-0">{isCorrect ? '✓' : '✗'}</span>
                    <div>
                      <p className={`font-bold text-base ${isCorrect ? 'text-emerald-300' : 'text-white/70'}`}>
                        {isCorrect ? 'Correct!' : 'Not quite — the answer is ' + challenge.options.find(o => o.id === challenge.correctId)?.text}
                      </p>
                      {isCorrect && !isCompleted && (
                        <p className="text-white/35 text-xs mt-0.5 flex items-center gap-1">
                          <Zap className="w-3 h-3" />+{challenge.xpReward} XP earned
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{challenge.explanation}</p>
                </div>

                {/* Countdown */}
                <div className="flex items-center justify-center gap-2 text-white/25 text-sm py-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next challenge in <span className="text-white/50 font-mono font-bold">{countdown}</span></span>
                </div>

                <Link href="/app">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-4 rounded-2xl bg-white text-black text-center font-bold text-sm cursor-pointer"
                  >
                    Back to home
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
