'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Crown } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { getLevelInfo } from '@/lib/levels';

type Tab = 'weekly' | 'alltime';

interface MockUser {
  name: string;
  avatar: string;
  weeklyXP: number;
  totalXP: number;
  streak: number;
}

const MOCK_USERS: MockUser[] = [
  { name: 'Minh Tú',       avatar: 'MT', weeklyXP: 1840, totalXP: 12400, streak: 34 },
  { name: 'Lan Anh',       avatar: 'LA', weeklyXP: 1650, totalXP: 9800,  streak: 28 },
  { name: 'Thanh Huyền',   avatar: 'TH', weeklyXP: 1420, totalXP: 8200,  streak: 21 },
  { name: 'Đức Minh',      avatar: 'ĐM', weeklyXP: 1210, totalXP: 7600,  streak: 15 },
  { name: 'Phương Linh',   avatar: 'PL', weeklyXP: 980,  totalXP: 6500,  streak: 12 },
  { name: 'Hoàng Bảo',     avatar: 'HB', weeklyXP: 860,  totalXP: 5900,  streak: 9  },
  { name: 'Thu Trang',     avatar: 'TT', weeklyXP: 720,  totalXP: 4200,  streak: 7  },
  { name: 'Nam Khánh',     avatar: 'NK', weeklyXP: 580,  totalXP: 3100,  streak: 5  },
  { name: 'Bảo Châu',      avatar: 'BC', weeklyXP: 430,  totalXP: 2400,  streak: 3  },
  { name: 'Việt Anh',      avatar: 'VA', weeklyXP: 310,  totalXP: 1800,  streak: 2  },
];

const RANK_COLORS = ['text-amber-400', 'text-slate-300', 'text-orange-400'];
const RANK_BG = ['bg-amber-500/10 border-amber-500/25', 'bg-slate-500/10 border-slate-500/25', 'bg-orange-500/10 border-orange-500/25'];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>('weekly');
  const { progress } = useProgress();

  const meWeekly: MockUser = {
    name: 'You',
    avatar: 'ME',
    weeklyXP: Math.min(progress.totalXP, 9999),
    totalXP: progress.totalXP,
    streak: progress.streak,
  };

  const allUsers = [...MOCK_USERS, meWeekly];
  const sorted = [...allUsers].sort((a, b) =>
    tab === 'weekly' ? b.weeklyXP - a.weeklyXP : b.totalXP - a.totalXP
  );

  const myRank = sorted.findIndex(u => u.name === 'You') + 1;

  return (
    <div className="min-h-screen bg-[#07070f] text-white px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <Trophy className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold">Leaderboard</h1>
            <p className="text-xs text-white/35">Bảng xếp hạng người học</p>
          </div>
        </div>

        {/* Your rank card */}
        <div className="p-4 rounded-2xl border border-violet-500/25 bg-violet-500/[0.05] mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/40 mb-1">Your rank this week</p>
              <p className="text-3xl font-black text-violet-300">#{myRank}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end mb-1">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-violet-300 text-sm font-bold">{progress.totalXP} XP</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 text-sm font-bold">{progress.streak} streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6">
          {(['weekly', 'alltime'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t === 'weekly' ? 'This Week' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[sorted[1], sorted[0], sorted[2]].map((user, podiumIdx) => {
            const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
            const isMe = user?.name === 'You';
            const levelInfo = getLevelInfo(user?.totalXP ?? 0);
            return (
              <motion.div
                key={user?.name}
                initial={{ opacity: 0, y: actualRank === 1 ? -10 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: podiumIdx * 0.1 }}
                className={`flex flex-col items-center py-4 px-2 rounded-2xl border ${
                  actualRank === 1
                    ? RANK_BG[0]
                    : actualRank === 2
                    ? RANK_BG[1]
                    : RANK_BG[2]
                } ${isMe ? 'ring-2 ring-violet-500/50' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-2 ${
                  isMe ? 'bg-violet-500/30 text-violet-200' : 'bg-white/10 text-white/70'
                }`}>
                  {user?.avatar}
                </div>
                {actualRank === 1 && <Crown className="w-4 h-4 text-amber-400 mb-1" />}
                <p className={`text-lg font-black ${RANK_COLORS[actualRank - 1]}`}>#{actualRank}</p>
                <p className="text-xs text-white/60 truncate max-w-full px-1">{user?.name}</p>
                <p className={`text-xs font-bold mt-1 ${levelInfo.color}`}>{levelInfo.emoji}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.05]">
            <p className="text-xs text-white/30 font-semibold uppercase tracking-widest">Full Rankings</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {sorted.map((user, idx) => {
              const rank = idx + 1;
              const isMe = user.name === 'You';
              const xp = tab === 'weekly' ? user.weeklyXP : user.totalXP;
              return (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`flex items-center gap-3 px-4 py-3 ${isMe ? 'bg-violet-500/[0.06]' : ''}`}
                >
                  <span className={`w-6 text-sm font-black text-center flex-shrink-0 ${
                    rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-orange-400' : 'text-white/30'
                  }`}>
                    {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    isMe ? 'bg-violet-500/30 text-violet-200' : 'bg-white/[0.06] text-white/50'
                  }`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isMe ? 'text-violet-200' : 'text-white/80'}`}>
                      {user.name} {isMe && <span className="text-xs text-violet-400">(you)</span>}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30">{user.streak}🔥</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${isMe ? 'text-violet-300' : 'text-white/60'}`}>
                      {xp.toLocaleString()} XP
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Leaderboard updates daily. Keep learning to climb the ranks!
        </p>
      </div>
    </div>
  );
}
