'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Flame, Zap, Lock, CheckCircle, Star,
  BookOpen, ChevronRight,
  Layers, MessageSquare, Music2, Clock, Link2, LayoutGrid,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useBadges } from '@/hooks/useBadges';
import { lessons } from '@/lib/lessonData';
import type { DayLesson } from '@/types';

const TYPE_LABELS = {
  'fill-blank': 'Fill in the Blank',
  'listen-choose': 'Listen & Answer',
  'choose-slang': 'Spot the Slang',
} as const;

const FEATURES = [
  {
    id: 'lessons',
    href: '/lesson/1',
    icon: BookOpen,
    title: '30-Day Speaking Course',
    desc: 'From first awkward meeting to confident communication',
    sub: '30 lessons, about 10–15 min each',
  },
  {
    id: 'shadowing',
    href: '/shadowing',
    icon: Layers,
    title: 'Shadowing',
    desc: 'Listen and mimic — the only real way to train your accent',
    sub: '30 sample sentences, A2 through C1',
  },
  {
    id: 'phrases',
    href: '/phrases',
    icon: LayoutGrid,
    title: 'Phrases & Chunks',
    desc: 'Learn collocations, phrasal verbs, and idioms — not single words',
    sub: '50+ real phrases: office, tech, meetings, email',
    isNew: true,
  },
  {
    id: 'conversation',
    href: '/conversation',
    icon: MessageSquare,
    title: 'Real Conversations',
    desc: 'Slang and idioms you won\'t find in any textbook',
    sub: '6 real tech workplace scenarios',
  },
  {
    id: 'alphabet',
    href: '/alphabet',
    icon: Music2,
    title: 'IPA Phonetics',
    desc: 'Why you get misheard even when you spell things right',
    sub: 'Focused on sounds Vietnamese speakers get wrong most',
    isNew: true,
  },
  {
    id: 'sources',
    href: '/sources',
    icon: Link2,
    title: 'Learning Sources',
    desc: 'Every reference used to build the content on this site',
    sub: 'Books, videos, research, and real-world data',
  },
];

export default function HomePage() {
  const { progress, loading, isDayCompleted, isDayUnlocked, getDayScore } = useProgress();
  const { challenge, isCompleted: challengeCompleted, streak: challengeStreak, countdown } = useDailyChallenge();
  const { earnedBadges, checkStreakBadges } = useBadges();

  useEffect(() => {
    if (!loading) checkStreakBadges(progress.streak);
  }, [progress.streak, loading, checkStreakBadges]);

  const totalDays = lessons.length;
  const completedDays = progress.completedDays.filter((d) => d.completed).length;
  const overallProgress = Math.round((completedDays / totalDays) * 100);

  const officeWeek = lessons.slice(0, 7);
  const travelWeek = lessons.slice(7, 15);
  const techWeek = lessons.slice(15, 22);
  const careerWeek = lessons.slice(22, 29);
  const finalDays = lessons.slice(29, 31);
  const nextLesson = !loading ? lessons.find((l) => isDayUnlocked(l.day) && !isDayCompleted(l.day)) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-white/[0.06] backdrop-blur-xl bg-black/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-bold text-sm">
              EN
            </div>
            <div>
              <p className="font-extrabold text-base leading-none tracking-tight">EnglishUp</p>
              <p className="text-white/30 text-xs">for developers</p>
            </div>
          </div>

          {!loading && (
            <div className="flex items-center gap-2">
              <StreakChip streak={progress.streak} />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                <Zap className="w-3.5 h-3.5 text-white/60" />
                <span className="text-white/70 font-bold text-sm">{progress.totalXP}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">

        {/* Hero */}
        <section className="pt-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-white/30 text-sm font-medium uppercase tracking-widest">english for the real world</p>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight">
              Speak English
              <br />
              <span className="text-white/40">without the fear</span>
            </h1>
            <p className="text-white/35 text-sm max-w-sm leading-relaxed">
              Not for exams. For meetings, emails, and working with teammates who don't speak your language.
            </p>
          </motion.div>

          {/* Continue CTA */}
          {nextLesson && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Link href={`/lesson/${nextLesson.day}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white text-black cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-xl flex-shrink-0">
                      {nextLesson.emoji}
                    </div>
                    <div>
                      <p className="text-black/50 text-xs font-semibold uppercase tracking-wider">
                        {completedDays === 0 ? 'Start' : 'Continue'} · Day {nextLesson.day}
                      </p>
                      <p className="font-bold text-sm">{nextLesson.title}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
                </motion.div>
              </Link>
            </motion.div>
          )}

          {/* Progress bar */}
          {completedDays > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 space-y-1.5"
            >
              <div className="flex justify-between text-xs text-white/25">
                <span>{completedDays}/{totalDays} days done</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}
        </section>

        {/* Daily Challenge */}
        <section className="mb-6">
          <Link href="/daily-challenge">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                challengeCompleted
                  ? 'border-white/10 bg-white/[0.03]'
                  : 'border-white/15 bg-white/[0.05] hover:border-white/25'
              }`}
            >
              {challengeCompleted ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-base flex-shrink-0">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-sm font-semibold">Today's challenge done</p>
                    <p className="text-white/25 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Next challenge in {countdown}
                    </p>
                  </div>
                  {challengeStreak > 0 && (
                    <span className="text-white/30 text-xs flex items-center gap-1 flex-shrink-0">
                      🔥 {challengeStreak}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-base flex-shrink-0">
                    ⚡
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">Daily Challenge</p>
                    <p className="text-white/35 text-xs mt-0.5">{TYPE_LABELS[challenge.type]} · +{challenge.xpReward} XP</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold flex-shrink-0">
                    Go
                  </div>
                </div>
              )}
            </motion.div>
          </Link>
        </section>

        {/* Feature Grid */}
        <section className="mb-12">
          <p className="text-white/25 text-xs uppercase tracking-widest font-semibold mb-4">pick what fits you</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link href={f.href}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-white">{f.title}</p>
                          {f.isNew && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/15">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-white/40 text-xs mt-0.5">{f.desc}</p>
                        <p className="text-white/20 text-xs mt-0.5">{f.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors flex-shrink-0 mt-0.5" />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <section className="mb-10">
            <p className="text-white/25 text-xs uppercase tracking-widest font-semibold mb-4">your badges</p>
            <div className="flex flex-wrap gap-3">
              {earnedBadges.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]"
                >
                  <span className="text-xl leading-none">{b.icon}</span>
                  <div>
                    <p className="text-white text-xs font-bold leading-none">{b.title}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Week 1 */}
        <WeekSection
          title="Week 1 — Office"
          subtitle="familiar situations from the workplace"
          days={officeWeek}
          isDayCompleted={isDayCompleted}
          isDayUnlocked={isDayUnlocked}
          getDayScore={getDayScore}
          loading={loading}
        />

        {/* Week 2 */}
        <WeekSection
          title="Week 2 — Travel"
          subtitle="navigating the world without just pointing"
          days={travelWeek}
          isDayCompleted={isDayCompleted}
          isDayUnlocked={isDayUnlocked}
          getDayScore={getDayScore}
          loading={loading}
        />

        {/* Week 3 */}
        <WeekSection
          title="Week 3 — Tech Communication"
          subtitle="code reviews, stand-ups, demos, and the jargon nobody teaches you"
          days={techWeek}
          isDayCompleted={isDayCompleted}
          isDayUnlocked={isDayUnlocked}
          getDayScore={getDayScore}
          loading={loading}
        />

        {/* Week 4 */}
        <WeekSection
          title="Week 4 — Career English"
          subtitle="interviews, negotiation, networking, and feedback that lands"
          days={careerWeek}
          isDayCompleted={isDayCompleted}
          isDayUnlocked={isDayUnlocked}
          getDayScore={getDayScore}
          loading={loading}
        />

        {/* Days 29–30 */}
        <section className="mt-8 space-y-3">
          <div className="px-1 mb-4">
            <h2 className="text-white font-bold text-base">Final Days</h2>
            <p className="text-white/30 text-xs mt-0.5">advanced conversations + mastery challenge</p>
          </div>
          {finalDays.map((lesson) => (
            <DayCard
              key={lesson.day}
              lesson={lesson}
              isCompleted={isDayCompleted(lesson.day)}
              isUnlocked={isDayUnlocked(lesson.day)}
              score={getDayScore(lesson.day)}
              loading={loading}
              isFinal={lesson.day === 30}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

function WeekSection({
  title, subtitle, days, isDayCompleted, isDayUnlocked, getDayScore, loading,
}: {
  title: string; subtitle: string; days: DayLesson[];
  isDayCompleted: (d: number) => boolean;
  isDayUnlocked: (d: number) => boolean;
  getDayScore: (d: number) => number;
  loading: boolean;
}) {
  return (
    <section className="mt-10">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-5"
      >
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="text-white/30 text-xs mt-0.5">{subtitle}</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {days.map((lesson, i) => (
          <motion.div
            key={lesson.day}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <DayCard
              lesson={lesson}
              isCompleted={isDayCompleted(lesson.day)}
              isUnlocked={isDayUnlocked(lesson.day)}
              score={getDayScore(lesson.day)}
              loading={loading}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DayCard({
  lesson, isCompleted, isUnlocked, score = 0, loading, isFinal = false,
}: {
  lesson: DayLesson; isCompleted: boolean; isUnlocked: boolean;
  score?: number; loading: boolean; isFinal?: boolean;
}) {
  const isLocked = !isUnlocked && !loading;
  const stars = score >= 90 ? 3 : score >= 60 ? 2 : 1;

  const card = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.01 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      className={`relative rounded-2xl border transition-all duration-200 ${isFinal ? 'p-5' : 'p-4'} ${
        isCompleted
          ? 'border-white/15 bg-white/[0.05]'
          : isLocked
          ? 'border-white/[0.04] bg-white/[0.01] opacity-40 cursor-not-allowed'
          : 'border-white/[0.07] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06] cursor-pointer'
      }`}
    >
      <div className={`relative z-10 ${isFinal ? 'text-center' : 'flex items-start gap-3'}`}>
        <div className={`${isFinal ? 'flex flex-col items-center gap-2 mb-3' : 'flex-shrink-0'}`}>
          <div
            className={`${isFinal ? 'w-16 h-16' : 'w-11 h-11'} rounded-xl flex items-center justify-center`}
            style={
              !isLocked
                ? { background: `linear-gradient(135deg, ${lesson.gradient[0]}70, ${lesson.gradient[1]}50)` }
                : { background: 'rgba(255,255,255,0.04)' }
            }
          >
            {isLocked ? (
              <Lock className="w-4 h-4 text-white/20" />
            ) : isCompleted ? (
              <CheckCircle className={`${isFinal ? 'w-8 h-8' : 'w-5 h-5'} text-white/70`} />
            ) : (
              <span className={isFinal ? 'text-3xl' : 'text-xl'}>{lesson.emoji}</span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              Day {lesson.day}
            </span>
            {isCompleted && (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-2.5 h-2.5 ${s <= stars ? 'text-white/60 fill-white/60' : 'text-white/10 fill-white/5'}`}
                  />
                ))}
              </div>
            )}
          </div>
          <h3 className={`font-bold mt-0.5 ${isFinal ? 'text-xl' : 'text-sm'} ${isLocked ? 'text-white/20' : 'text-white'}`}>
            {lesson.title}
          </h3>
          <p className={`text-xs mt-0.5 ${isLocked ? 'text-white/15' : 'text-white/35'}`}>{lesson.subtitle}</p>

          {!isLocked && (
            <div className="flex items-center gap-2 mt-2 text-[10px] text-white/25">
              <span>{lesson.xpReward} XP</span>
              <span>·</span>
              <span>{lesson.vocabulary.length} words</span>
              <span>·</span>
              <span>{lesson.exercises.length} exercises</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isLocked || loading) return card;
  return <Link href={`/lesson/${lesson.day}`}>{card}</Link>;
}

function StreakChip({ streak }: { streak: number }) {
  const isHot = streak >= 7;
  const isFire = streak >= 30;

  return (
    <motion.div
      animate={isHot ? { boxShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 10px rgba(251,191,36,0.25)', '0 0 0px rgba(251,191,36,0)'] } : {}}
      transition={{ repeat: Infinity, duration: 2.5 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
        isFire ? 'bg-orange-500/10 border-orange-500/30' :
        isHot ? 'bg-amber-500/10 border-amber-500/20' :
        'bg-white/[0.05] border-white/[0.08]'
      }`}
    >
      <motion.div
        animate={isHot ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <Flame className={`${
          isFire ? 'w-5 h-5 text-orange-400' :
          isHot ? 'w-4 h-4 text-amber-400' :
          'w-3.5 h-3.5 text-white/60'
        }`} />
      </motion.div>
      <span className={`font-bold text-sm ${
        isFire ? 'text-orange-300' :
        isHot ? 'text-amber-300' :
        'text-white/70'
      }`}>{streak}</span>
    </motion.div>
  );
}
