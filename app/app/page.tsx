'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  Flame, Zap, Lock, CheckCircle, Star,
  ChevronRight, Layers, MessageSquare, Music2, Clock, Link2, LayoutGrid, Bot,
  Target, TrendingUp, Mic2, Trophy, Library,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { useBadges } from '@/hooks/useBadges';
import { getLevelInfo } from '@/lib/levels';
import { lessons } from '@/lib/lessonData';
import type { DayLesson } from '@/types';
import AppShell from '@/components/AppShell';

const TYPE_LABELS = {
  'fill-blank': 'Fill in the Blank',
  'listen-choose': 'Listen & Answer',
  'choose-slang': 'Spot the Slang',
} as const;

interface Feature {
  id: string;
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  badge?: { label: string; color: string };
}

const FEATURES: Feature[] = [
  {
    id: 'speaking-course',
    href: '/speaking-course',
    icon: Mic2,
    title: 'SG Speaking Sprint',
    desc: '15-day listening & speaking intensive',
    color: 'text-rose-400',
    badge: { label: 'HOT', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  },
  {
    id: 'shadowing',
    href: '/shadowing',
    icon: Layers,
    title: 'Shadowing',
    desc: 'Mimic native speakers to train your accent',
    color: 'text-cyan-400',
  },
  {
    id: 'vocabulary',
    href: '/vocabulary',
    icon: Library,
    title: 'Vocabulary SRS',
    desc: 'Anki-style spaced repetition flashcards',
    color: 'text-emerald-400',
  },
  {
    id: 'ai-chat',
    href: '/ai-chat',
    icon: Bot,
    title: 'AI Chat',
    desc: 'Practice real scenarios with instant corrections',
    color: 'text-violet-400',
    badge: { label: 'PRO', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  },
  {
    id: 'phrases',
    href: '/phrases',
    icon: LayoutGrid,
    title: 'Phrases & Chunks',
    desc: '50+ collocations, idioms and office language',
    color: 'text-amber-400',
  },
  {
    id: 'conversation',
    href: '/conversation',
    icon: MessageSquare,
    title: 'Real Conversations',
    desc: '6 tech workplace scenarios with key phrases',
    color: 'text-indigo-400',
  },
  {
    id: 'alphabet',
    href: '/alphabet',
    icon: Music2,
    title: 'IPA Phonetics',
    desc: 'Sounds Vietnamese speakers struggle with most',
    color: 'text-pink-400',
  },
  {
    id: 'leaderboard',
    href: '/leaderboard',
    icon: Trophy,
    title: 'Leaderboard',
    desc: 'See how you rank against other learners',
    color: 'text-amber-400',
  },
  {
    id: 'sources',
    href: '/sources',
    icon: Link2,
    title: 'Learning Sources',
    desc: 'Every reference used to build this content',
    color: 'text-white/40',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

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
  const levelInfo = getLevelInfo(progress.totalXP);

  const officeWeek = lessons.slice(0, 7);
  const travelWeek = lessons.slice(7, 15);
  const techWeek = lessons.slice(15, 22);
  const careerWeek = lessons.slice(22, 29);
  const finalDays = lessons.slice(29, 31);
  const nextLesson = !loading ? lessons.find((l) => isDayUnlocked(l.day) && !isDayCompleted(l.day)) : null;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-20">

        {/* Hero header */}
        <motion.div {...fadeUp(0)} className="pt-8 pb-2 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Dashboard</h1>
              <p className="text-white/30 text-sm mt-1">Keep the momentum going</p>
            </div>
            {!loading && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${levelInfo.bg} border ${levelInfo.border} flex-shrink-0`}>
                <span className="text-lg leading-none">{levelInfo.emoji}</span>
                <span className={`text-xs font-bold ${levelInfo.color} hidden sm:block`}>{levelInfo.name}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stat cards */}
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Flame,      label: 'Day Streak',  value: progress.streak,              accent: 'amber'   },
              { icon: Zap,        label: 'Total XP',    value: progress.totalXP,             accent: 'violet'  },
              { icon: Target,     label: 'Days Done',   value: `${completedDays}/${totalDays}`, accent: 'emerald' },
              { icon: TrendingUp, label: 'Progress',    value: `${overallProgress}%`,        accent: 'cyan'    },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(0.05 + i * 0.07)}>
                <StatCard icon={s.icon} label={s.label} value={s.value} accent={s.accent as StatAccent} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Continue lesson */}
        {nextLesson && (
          <motion.div {...fadeUp(0.32)} className="mb-5">
            <Link href={`/lesson/${nextLesson.day}`}>
              <motion.div
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white text-black cursor-pointer shadow-lg shadow-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/8 flex items-center justify-center text-2xl flex-shrink-0">
                    {nextLesson.emoji}
                  </div>
                  <div>
                    <p className="text-black/40 text-xs font-bold uppercase tracking-wider">
                      {completedDays === 0 ? 'Start' : 'Continue'} · Day {nextLesson.day}
                    </p>
                    <p className="font-bold text-base mt-0.5">{nextLesson.title}</p>
                    <p className="text-black/40 text-xs mt-0.5">{nextLesson.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-black/40">{nextLesson.xpReward} XP</span>
                  <ChevronRight className="w-5 h-5 text-black/30" />
                </div>
              </motion.div>
            </Link>
            {completedDays > 0 && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-white/20">
                  <span>{completedDays}/{totalDays} days done</span>
                  <span>{overallProgress}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Daily Challenge */}
        <motion.div {...fadeUp(0.38)} className="mb-8">
          <Link href="/daily-challenge">
            <motion.div
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              className={`p-4 rounded-2xl border cursor-pointer transition-colors ${
                challengeCompleted
                  ? 'border-white/[0.07] bg-white/[0.02]'
                  : 'border-amber-500/25 bg-amber-500/[0.04] hover:border-amber-500/40'
              }`}
            >
              {challengeCompleted ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-sm flex-shrink-0">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-sm font-semibold">Today's challenge done</p>
                    <p className="text-white/20 text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Next in {countdown}
                    </p>
                  </div>
                  {challengeStreak > 0 && (
                    <span className="text-white/25 text-xs flex items-center gap-1 flex-shrink-0">
                      🔥 {challengeStreak}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-base flex-shrink-0">
                    ⚡
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">Daily Challenge</p>
                    <p className="text-white/35 text-xs mt-0.5">{TYPE_LABELS[challenge.type]} · +{challenge.xpReward} XP</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex-shrink-0">
                    Go
                  </div>
                </div>
              )}
            </motion.div>
          </Link>
        </motion.div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <motion.div {...fadeUp(0.44)} className="mb-8">
            <SectionLabel>Your badges</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 280 }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07]"
                >
                  <span className="text-xl leading-none">{b.icon}</span>
                  <div>
                    <p className="text-white text-xs font-bold leading-none">{b.title}</p>
                    <p className="text-white/25 text-[10px] mt-0.5">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Learning tools */}
        <motion.div {...fadeUp(0.48)} className="mb-10">
          <SectionLabel>Learning tools</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52 + i * 0.055 }}
                >
                  <Link href={f.href}>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all group cursor-pointer h-full">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-white/[0.08] transition-colors">
                        <Icon className={`w-4 h-4 ${f.color} transition-opacity group-hover:opacity-100 opacity-70`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">
                            {f.title}
                          </p>
                          {f.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${f.badge.color}`}>
                              {f.badge.label}
                            </span>
                          )}
                        </div>
                        <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Week sections */}
        <div className="space-y-12">
          <WeekSection
            title="Week 1 — Office"
            subtitle="Familiar situations from the workplace"
            days={officeWeek}
            isDayCompleted={isDayCompleted}
            isDayUnlocked={isDayUnlocked}
            getDayScore={getDayScore}
            loading={loading}
          />
          <WeekSection
            title="Week 2 — Travel"
            subtitle="Navigating the world without just pointing"
            days={travelWeek}
            isDayCompleted={isDayCompleted}
            isDayUnlocked={isDayUnlocked}
            getDayScore={getDayScore}
            loading={loading}
          />
          <WeekSection
            title="Week 3 — Tech Communication"
            subtitle="Code reviews, stand-ups, demos, and the jargon nobody teaches"
            days={techWeek}
            isDayCompleted={isDayCompleted}
            isDayUnlocked={isDayUnlocked}
            getDayScore={getDayScore}
            loading={loading}
          />
          <WeekSection
            title="Week 4 — Career English"
            subtitle="Interviews, negotiation, networking, and feedback"
            days={careerWeek}
            isDayCompleted={isDayCompleted}
            isDayUnlocked={isDayUnlocked}
            getDayScore={getDayScore}
            loading={loading}
          />

          {/* Final days */}
          <section>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-5"
            >
              <h2 className="text-base font-bold text-white">Final Days</h2>
              <p className="text-white/25 text-xs mt-0.5">Advanced conversations + mastery challenge</p>
            </motion.div>
            <div className="space-y-3">
              {finalDays.map((lesson, i) => (
                <motion.div
                  key={lesson.day}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <DayCard
                    lesson={lesson}
                    isCompleted={isDayCompleted(lesson.day)}
                    isUnlocked={isDayUnlocked(lesson.day)}
                    score={getDayScore(lesson.day)}
                    loading={loading}
                    isFinal={lesson.day === 30}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white/20 text-xs uppercase tracking-widest font-semibold mb-4">{children}</p>
  );
}

type StatAccent = 'amber' | 'violet' | 'emerald' | 'cyan';

const ACCENT_COLORS: Record<StatAccent, { bg: string; border: string; icon: string; value: string }> = {
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'text-amber-400',   value: 'text-amber-300'   },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  icon: 'text-violet-400',  value: 'text-violet-300'  },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', value: 'text-emerald-300' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    icon: 'text-cyan-400',    value: 'text-cyan-300'    },
};

function StatCard({
  icon: Icon, label, value, accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: StatAccent;
}) {
  const c = ACCENT_COLORS[accent];
  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col gap-3 h-full">
      <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${c.icon}`} />
      </div>
      <div>
        <p className={`text-2xl font-black ${c.value}`}>{value}</p>
        <p className="text-white/30 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function WeekSection({
  title, subtitle, days, isDayCompleted, isDayUnlocked, getDayScore, loading,
}: {
  title: string;
  subtitle: string;
  days: DayLesson[];
  isDayCompleted: (d: number) => boolean;
  isDayUnlocked: (d: number) => boolean;
  getDayScore: (d: number) => number;
  loading: boolean;
}) {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-5"
      >
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="text-white/25 text-xs mt-0.5">{subtitle}</p>
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
  lesson: DayLesson;
  isCompleted: boolean;
  isUnlocked: boolean;
  score?: number;
  loading: boolean;
  isFinal?: boolean;
}) {
  const isLocked = !isUnlocked && !loading;
  const stars = score >= 90 ? 3 : score >= 60 ? 2 : 1;

  const card = (
    <motion.div
      whileHover={!isLocked ? { scale: 1.01 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      className={`relative rounded-2xl border transition-all duration-200 ${isFinal ? 'p-5' : 'p-4'} ${
        isCompleted
          ? 'border-white/[0.12] bg-white/[0.04]'
          : isLocked
          ? 'border-white/[0.04] bg-white/[0.01] opacity-40 cursor-not-allowed'
          : 'border-white/[0.07] bg-white/[0.025] hover:border-white/[0.13] hover:bg-white/[0.05] cursor-pointer'
      }`}
    >
      <div className={`relative z-10 ${isFinal ? 'text-center' : 'flex items-start gap-3'}`}>
        <div className={`${isFinal ? 'flex flex-col items-center gap-2 mb-3' : 'flex-shrink-0'}`}>
          <div
            className={`${isFinal ? 'w-16 h-16' : 'w-11 h-11'} rounded-xl flex items-center justify-center`}
            style={
              !isLocked
                ? { background: `linear-gradient(135deg, ${lesson.gradient[0]}60, ${lesson.gradient[1]}40)` }
                : { background: 'rgba(255,255,255,0.03)' }
            }
          >
            {isLocked ? (
              <Lock className="w-4 h-4 text-white/15" />
            ) : isCompleted ? (
              <CheckCircle className={`${isFinal ? 'w-8 h-8' : 'w-5 h-5'} text-white/60`} />
            ) : (
              <span className={isFinal ? 'text-3xl' : 'text-xl'}>{lesson.emoji}</span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/25">
              Day {lesson.day}
            </span>
            {isCompleted && (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-2.5 h-2.5 ${s <= stars ? 'text-amber-400 fill-amber-400' : 'text-white/10 fill-white/5'}`}
                  />
                ))}
              </div>
            )}
          </div>
          <h3
            className={`font-bold mt-0.5 ${isFinal ? 'text-xl' : 'text-sm'} ${
              isLocked ? 'text-white/15' : 'text-white'
            }`}
          >
            {lesson.title}
          </h3>
          <p className={`text-xs mt-0.5 ${isLocked ? 'text-white/10' : 'text-white/30'}`}>
            {lesson.subtitle}
          </p>
          {!isLocked && (
            <div className="flex items-center gap-2 mt-2 text-[10px] text-white/20">
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
