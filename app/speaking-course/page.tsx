'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Lock, Clock, Plane, Mic2, ChevronRight, AlertTriangle } from 'lucide-react';
import { speakingDays } from '@/lib/speakingCourseData';
import AppShell from '@/components/AppShell';

export default function SpeakingCoursePage() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sg-sprint-progress');
      if (saved) setCompletedDays(JSON.parse(saved) as number[]);
    } catch { /* ignore */ }
  }, []);

  // Days to Singapore: from today to 2026-06-06
  const daysLeft = Math.ceil((new Date('2026-06-06').getTime() - Date.now()) / 86400000);

  // Day N is unlocked if N===1 OR day N-1 is in completedDays
  const isDayUnlocked = (day: number) => day === 1 || completedDays.includes(day - 1);
  const isDayCompleted = (day: number) => completedDays.includes(day);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">SG Speaking Sprint</h1>
              <p className="text-white/30 text-sm">15-day listening & speaking intensive · 1 hour/day</p>
            </div>
          </div>
        </div>

        {/* Countdown banner */}
        {daysLeft > 0 && daysLeft <= 20 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
              daysLeft <= 16
                ? 'bg-amber-500/[0.08] border-amber-500/25'
                : 'bg-cyan-500/[0.08] border-cyan-500/25'
            }`}
          >
            {daysLeft <= 16 ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <Plane className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            )}
            <div>
              <p className={`font-bold text-sm ${daysLeft <= 16 ? 'text-amber-300' : 'text-cyan-300'}`}>
                {daysLeft} days until Singapore — {daysLeft <= 15 ? "start today!" : "you're right on track!"}
              </p>
              <p className="text-white/30 text-xs mt-0.5">
                {completedDays.length}/{speakingDays.length} sessions completed
              </p>
            </div>
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-white/20 mb-1.5">
            <span>{completedDays.length} of 15 days done</span>
            <span>{Math.round((completedDays.length / 15) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedDays.length / 15) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {speakingDays.map((day, i) => {
            const unlocked = isDayUnlocked(day.day);
            const completed = isDayCompleted(day.day);
            const card = (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={unlocked ? { scale: 1.02 } : {}}
                className={`relative rounded-2xl border overflow-hidden transition-all ${
                  completed
                    ? 'border-white/[0.12] bg-white/[0.04]'
                    : unlocked
                    ? 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.06] cursor-pointer'
                    : 'border-white/[0.04] bg-white/[0.01] opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Gradient accent strip */}
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: `linear-gradient(to bottom, ${day.gradient[0]}, ${day.gradient[1]})` }}
                />
                <div className="p-4 pl-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl leading-none mt-0.5">{day.emoji}</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-0.5">Day {day.day}</p>
                        <p className="font-bold text-sm text-white leading-snug">{day.title}</p>
                        <p className="text-white/35 text-xs mt-0.5">{day.subtitle}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Clock className="w-3 h-3 text-white/20" />
                          <span className="text-[10px] text-white/20">60 min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : !unlocked ? (
                        <Lock className="w-4 h-4 text-white/15" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/20" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
            if (!unlocked) return card;
            return <Link key={day.day} href={`/speaking-course/${day.day}`}>{card}</Link>;
          })}
        </div>
      </div>
    </AppShell>
  );
}
