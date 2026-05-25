'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Zap, X, Volume2, Home, RotateCcw } from 'lucide-react';
import { getLessonByDay } from '@/lib/lessonData';
import { useProgress } from '@/hooks/useProgress';
import { useTTS } from '@/hooks/useSpeech';
import VocabPhase from '@/components/VocabPhase';
import LessonComplete from '@/components/LessonComplete';
import MultipleChoice from '@/components/exercises/MultipleChoice';
import WordOrder from '@/components/exercises/WordOrder';
import FillBlank from '@/components/exercises/FillBlank';
import ListenChoose from '@/components/exercises/ListenChoose';
import WordMatch from '@/components/exercises/WordMatch';
import Speaking from '@/components/exercises/Speaking';
import PronunciationCheck from '@/components/exercises/PronunciationCheck';
import PremiumGate from '@/components/PremiumGate';
import { useAuth } from '@/contexts/AuthContext';
import type { Exercise } from '@/types';

type Phase = 'vocab' | 'exercise' | 'complete' | 'gameover';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const day = Number(params.day);
  const lesson = getLessonByDay(day);
  const { saveDay, isDayUnlocked } = useProgress();
  const { speak } = useTTS();
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('vocab');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [feedbackAnswer, setFeedbackAnswer] = useState<string | null>(null);
  const [feedbackHint, setFeedbackHint] = useState<string | null>(null);
  const [feedbackQuestion, setFeedbackQuestion] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (!lesson) { router.push('/'); return; }
    if (!isDayUnlocked(day)) { router.push('/'); return; }
  }, [lesson, day, isDayUnlocked, router]);

  if (!lesson) return null;

  const exercises = lesson.exercises;
  const currentExercise = exercises[exerciseIndex];
  const progress = ((exerciseIndex) / exercises.length) * 100;

  const handleExerciseComplete = (correct: boolean) => {
    const newHearts = correct ? hearts : Math.max(0, hearts - 1);
    setShowFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setCorrectCount((c) => c + 1);
      setXpEarned((x) => x + Math.floor(lesson.xpReward / exercises.length));
    } else {
      setHearts(newHearts);
      const ans = currentExercise.correct;
      setFeedbackAnswer(ans !== 'matched' ? ans : null);
      setFeedbackHint(currentExercise.hint ?? null);
      setFeedbackQuestion(currentExercise.question ?? null);
    }
    setTimeout(() => {
      setShowFeedback(null);
      setFeedbackAnswer(null);
      if (!correct && newHearts === 0) {
        setPhase('gameover');
        return;
      }
      if (exerciseIndex < exercises.length - 1) {
        setExerciseIndex((i) => i + 1);
      } else {
        const finalXP = correct
          ? xpEarned + Math.floor(lesson.xpReward / exercises.length)
          : xpEarned;
        const finalCorrect = correct ? correctCount + 1 : correctCount;
        const score = Math.round((finalCorrect / exercises.length) * 100);
        saveDay(day, score, finalXP);
        setPhase('complete');
      }
    }, 1400);
  };

  const renderExercise = (exercise: Exercise) => {
    const props = { exercise, onComplete: handleExerciseComplete };
    switch (exercise.type) {
      case 'multiple-choice': return <MultipleChoice {...props} />;
      case 'word-order': return <WordOrder {...props} />;
      case 'fill-blank': return <FillBlank {...props} />;
      case 'listen-choose': return <ListenChoose {...props} />;
      case 'word-match': return <WordMatch {...props} />;
      case 'speaking': return <Speaking {...props} />;
      case 'pronunciation': return <PronunciationCheck {...props} />;
      default: return null;
    }
  };

  const handleRestart = () => {
    setPhase('vocab');
    setExerciseIndex(0);
    setHearts(3);
    setCorrectCount(0);
    setXpEarned(0);
    setShowFeedback(null);
    setFeedbackAnswer(null);
    setFeedbackHint(null);
    setFeedbackQuestion(null);
  };

  const isPremium = user?.role === 'admin' || user?.subscription?.status === 'active';
  if (day > 1 && !isPremium) {
    return <PremiumGate mode="fullscreen" featureName={`Day ${day} Lesson`} />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${lesson.gradient[0]}15 0%, #0a0a1a 50%, ${lesson.gradient[1]}10 100%)` }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.push('/')} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>

          {phase === 'exercise' && (
            <>
              {/* Progress bar */}
              <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${lesson.gradient[0]}, ${lesson.gradient[1]})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>

              {/* Hearts */}
              <div className="flex gap-1">
                {[1, 2, 3].map((h) => (
                  <motion.span
                    key={h}
                    animate={hearts < h ? { scale: [1, 0.7, 1], opacity: [1, 0.3, 0.3] } : {}}
                    className={`text-xl transition-all ${hearts >= h ? '' : 'opacity-25'}`}
                  >
                    ❤️
                  </motion.span>
                ))}
              </div>

              {/* XP */}
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                <Zap className="w-4 h-4 fill-amber-400" />
                <span>{xpEarned}</span>
              </div>
            </>
          )}

          {phase === 'vocab' && (
            <div className="flex-1 text-center">
              <p className="text-white font-semibold">{lesson.emoji} {lesson.title}</p>
              <p className="text-white/40 text-xs">Ngày {lesson.day}</p>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'vocab' && (
            <motion.div key="vocab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <VocabPhase vocab={lesson.vocabulary} onDone={() => setPhase('exercise')} />
            </motion.div>
          )}

          {phase === 'exercise' && (
            <motion.div key={`ex-${exerciseIndex}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              {/* Exercise type label */}
              <div className="mb-6 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/50 text-xs font-semibold uppercase tracking-wider">
                  {exerciseIndex + 1} / {exercises.length}
                </span>
                {currentExercise.audioText && currentExercise.type !== 'listen-choose' && currentExercise.type !== 'speaking' && (
                  <button
                    onClick={() => speak(currentExercise.audioText!)}
                    className="p-2 rounded-full bg-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur p-6">
                {renderExercise(currentExercise)}
              </div>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <LessonComplete
                day={day}
                correctCount={correctCount}
                totalExercises={exercises.length}
                xpEarned={xpEarned}
                onRestart={handleRestart}
              />
            </motion.div>
          )}

          {phase === 'gameover' && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="text-center space-y-8 py-4">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-500/40 text-5xl"
                >
                  💔
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-extrabold text-white">Out of hearts!</h2>
                  <p className="text-white/60">Don't give up, try again!</p>
                </div>
                <div className="flex gap-3 max-w-xs mx-auto">
                  <button
                    onClick={() => router.push('/')}
                    className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border-2 border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-red-600 to-rose-600 text-white"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Feedback overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t-2 ${
              showFeedback === 'correct'
                ? 'bg-[#0a1f15]/97 border-emerald-500/60'
                : 'bg-[#1f0a0a]/97 border-red-500/60'
            }`}
          >
            <div className="max-w-2xl mx-auto px-5 py-5 space-y-3">
              {showFeedback === 'correct' ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-xl">✓</div>
                  <div>
                    <p className="font-bold text-emerald-300 text-base leading-none">Correct!</p>
                    <p className="text-emerald-400/60 text-sm mt-0.5">Keep it up</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-xl">✗</div>
                    <p className="font-bold text-red-300 text-base">Incorrect</p>
                  </div>

                  {feedbackAnswer && (
                    <div className="flex items-start gap-2 pl-1">
                      <span className="text-white/30 text-xs mt-1 flex-shrink-0">Correct answer</span>
                      <div className="flex-1 px-3 py-2 rounded-xl bg-white/8 border border-white/12">
                        <p className="text-white font-bold text-sm leading-relaxed">{feedbackAnswer}</p>
                      </div>
                    </div>
                  )}

                  {feedbackHint && (
                    <div className="flex items-start gap-2 pl-1">
                      <span className="text-amber-400/60 text-xs mt-0.5 flex-shrink-0">💡</span>
                      <p className="text-amber-200/70 text-xs leading-relaxed">{feedbackHint}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
