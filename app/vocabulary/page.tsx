'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Volume2, CheckCircle, RefreshCw, ChevronRight, BookOpen, Zap } from 'lucide-react';
import { useVocabSRS, SRSRating } from '@/hooks/useVocabSRS';
import { useProgress } from '@/hooks/useProgress';
import { lessons } from '@/lib/lessonData';
import PremiumGate from '@/components/PremiumGate';
import { useAuth } from '@/contexts/AuthContext';

const RATING_BUTTONS: { rating: SRSRating; label: string; color: string; days: string }[] = [
  { rating: 0, label: 'Again', color: 'bg-red-500/15 border-red-500/30 text-red-300 hover:bg-red-500/25', days: '1d' },
  { rating: 1, label: 'Hard', color: 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25', days: '3d' },
  { rating: 2, label: 'Good', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25', days: '7d' },
  { rating: 3, label: 'Easy', color: 'bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/25', days: '14d' },
];

export default function VocabularyPage() {
  const { user } = useAuth();
  const { dueCards, addNewCards, reviewCard, stats, loaded } = useVocabSRS();
  const { progress } = useProgress();
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);
  const [queue, setQueue] = useState<typeof dueCards>([]);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    const completedDays = progress.completedDays.filter(d => d.completed).map(d => d.day);
    completedDays.forEach(day => {
      const lesson = lessons.find(l => l.day === day);
      if (lesson?.vocabulary) addNewCards(lesson.vocabulary, day);
    });
    setSynced(true);
  }, [loaded, progress.completedDays, addNewCards]);

  useEffect(() => {
    if (synced) setQueue([...dueCards]);
  }, [synced]);

  const current = queue[0];

  function handleRate(rating: SRSRating) {
    if (!current) return;
    reviewCard(current.word, rating);
    setQueue(q => q.slice(1));
    setSessionDone(n => n + 1);
    setFlipped(false);
  }

  function handleSpeak(text: string) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  }

  if (!loaded || !synced) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const noCompletedLessons = progress.completedDays.filter(d => d.completed).length === 0;

  if (noCompletedLessons) {
    return (
      <div className="min-h-screen bg-[#07070f] text-white flex flex-col items-center justify-center px-4 text-center">
        <BookOpen className="w-12 h-12 text-white/20 mb-4" />
        <h2 className="text-xl font-bold mb-2">No vocabulary yet</h2>
        <p className="text-white/40 text-sm mb-6">Complete at least one lesson to unlock vocabulary cards.</p>
        <a href="/lesson/1" className="px-5 py-2.5 rounded-xl bg-violet-600 text-sm font-bold hover:bg-violet-500 transition-colors">
          Start Lesson 1
        </a>
      </div>
    );
  }

  const isPremium = user?.role === 'admin' || user?.subscription?.status === 'active';
  if (!isPremium) {
    return <PremiumGate mode="fullscreen" featureName="Vocabulary SRS" />;
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Library className="w-4.5 h-4.5 text-violet-400" />
            </div>
            <div>
              <h1 className="font-bold">Vocabulary SRS</h1>
              <p className="text-xs text-white/35">Spaced repetition review</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-violet-300 text-xs font-bold">{stats.total} cards</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { label: 'Due today', value: stats.dueToday, color: 'text-amber-300' },
            { label: 'Reviewed', value: sessionDone, color: 'text-emerald-300' },
            { label: 'Mastered', value: stats.masteredCount, color: 'text-violet-300' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl border border-white/[0.07] bg-white/[0.02] text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Card or empty state */}
        <AnimatePresence mode="wait">
          {queue.length === 0 ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black mb-2">All done!</h2>
              <p className="text-white/40 text-sm mb-6">
                {sessionDone > 0
                  ? `You reviewed ${sessionDone} card${sessionDone > 1 ? 's' : ''} this session.`
                  : 'No cards due today. Come back tomorrow!'}
              </p>
              {sessionDone > 0 && (
                <button
                  onClick={() => { setQueue([...dueCards]); setSessionDone(0); setFlipped(false); }}
                  className="flex items-center gap-2 mx-auto px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Review again
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div key={current.word} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              {/* Progress bar */}
              <div className="h-1 bg-white/[0.05] rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all"
                  style={{ width: `${Math.max(5, ((dueCards.length - queue.length) / dueCards.length) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-white/30 text-center mb-3">{dueCards.length - queue.length + 1} / {dueCards.length}</p>

              {/* Flashcard */}
              <div
                className="relative cursor-pointer select-none mb-6"
                style={{ perspective: '1200px' }}
                onClick={() => !flipped && setFlipped(true)}
              >
                <motion.div
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateX: flipped ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="relative"
                >
                  {/* Front */}
                  <div
                    className="p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-center min-h-[200px] flex flex-col items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-3xl font-black mb-2">{current.word}</div>
                    <div className="text-white/40 text-sm mb-4">{current.phonetic}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSpeak(current.word); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:text-white/70 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Pronounce
                    </button>
                    {!flipped && (
                      <p className="text-white/20 text-xs mt-6 flex items-center gap-1">
                        Tap to reveal <ChevronRight className="w-3 h-3" />
                      </p>
                    )}
                  </div>

                  {/* Back */}
                  <div
                    className="p-8 rounded-2xl border border-violet-500/30 bg-violet-500/[0.04] text-center min-h-[200px] flex flex-col items-center justify-center absolute inset-0"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                  >
                    <div className="text-lg font-bold text-violet-200 mb-1">{current.translation}</div>
                    <div className="text-white/50 text-sm italic mb-4 px-4">"{current.example}"</div>
                    {current.exampleTranslation && (
                      <div className="text-white/25 text-xs px-4">{current.exampleTranslation}</div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Rating buttons — only show after flip */}
              <AnimatePresence>
                {flipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-4 gap-2"
                  >
                    {RATING_BUTTONS.map(btn => (
                      <button
                        key={btn.rating}
                        onClick={() => handleRate(btn.rating)}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${btn.color}`}
                      >
                        <div>{btn.label}</div>
                        <div className="text-[10px] opacity-60 mt-0.5">{btn.days}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Day source badge */}
              <p className="text-center text-xs text-white/20 mt-4">Day {current.sourceDay}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
