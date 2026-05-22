'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Home, RotateCcw, ChevronRight, Award } from 'lucide-react';
import Link from 'next/link';
import CertificateCanvas from './CertificateCanvas';

interface Props {
  day: number;
  correctCount: number;
  totalExercises: number;
  xpEarned: number;
  onRestart: () => void;
}

function Confetti() {
  const colors = ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#F97316'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            rotate: Math.random() * 360,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720],
            opacity: [1, 0.8, 0],
          }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1.5, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

export default function LessonComplete({ day, correctCount, totalExercises, xpEarned, onRestart }: Props) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showCert, setShowCert] = useState(false);
  const score = Math.round((correctCount / totalExercises) * 100);
  const stars = score >= 90 ? 3 : score >= 60 ? 2 : 1;
  const title = score >= 90 ? 'Xuất sắc!' : score >= 60 ? 'Khá tốt!' : 'Cố gắng hơn nhé!';
  const subtitle = score >= 60 ? `Ngày ${day} hoàn thành` : 'Hãy ôn lại và thử lại!';

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      {showCert && (
        <CertificateCanvas
          courseName="30-Day English Learning Path"
          completedDate={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          xpEarned={xpEarned}
          onClose={() => setShowCert(false)}
        />
      )}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="text-center space-y-8 py-4"
      >
        {/* Trophy */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/40"
        >
          <Trophy className="w-14 h-14 text-white" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-white">{title}</h2>
          <p className="text-white/60">{subtitle}</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + s * 0.15, type: 'spring', stiffness: 300 }}
            >
              <Star
                className={`w-12 h-12 ${s <= stars ? 'text-amber-400 fill-amber-400' : 'text-white/20 fill-white/10'}`}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Điểm số', value: `${score}%`, icon: '🎯' },
            { label: 'Đúng', value: `${correctCount}/${totalExercises}`, icon: '✅' },
            { label: 'XP nhận', value: `+${xpEarned}`, icon: '⚡' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1"
            >
              <p className="text-2xl">{stat.icon}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* XP animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
        >
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-amber-300 font-bold">+{xpEarned} XP earned</span>
        </motion.div>

        {/* Certificate for day 30 */}
        {day === 30 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            onClick={() => setShowCert(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-bold hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
          >
            <Award className="w-5 h-5" />
            Get Your Certificate
          </motion.button>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 py-4 rounded-2xl border-2 border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <Link
            href="/app"
            className="flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border-2 border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all"
          >
            <Home className="w-4 h-4" />
          </Link>
          {day < 15 ? (
            <Link
              href={`/lesson/${day + 1}`}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
            >
              Bài tiếp theo
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/app"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
          )}
        </div>
      </motion.div>
    </>
  );
}
