'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid, BookOpen, Bot, Layers,
  MessageSquare, Music2, Target, Flame, Zap, LogOut, X, Mic2, Library, Trophy,
  Shield, Crown,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { getLevelInfo, getLevelProgress } from '@/lib/levels';
import { useAuth } from '@/contexts/AuthContext';
import { isNativeIOS } from '@/lib/platform';
import Logo from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
  matchPrefix?: string;
  badge?: string;
  showDot?: boolean;
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [
      { href: '/app', icon: LayoutGrid, label: 'Dashboard', exact: true },
      { href: '/daily-challenge', icon: Target, label: 'Daily Challenge', showDot: true },
    ],
  },
  {
    section: 'Learn',
    items: [
      { href: '/lesson/1', icon: BookOpen, label: 'Lessons', matchPrefix: '/lesson' },
      { href: '/ai-chat', icon: Bot, label: 'AI Chat', badge: 'PRO' },
      { href: '/shadowing', icon: Layers, label: 'Shadowing' },
      { href: '/phrases', icon: MessageSquare, label: 'Phrases' },
      { href: '/conversation', icon: MessageSquare, label: 'Conversations' },
      { href: '/alphabet', icon: Music2, label: 'IPA Phonetics' },
      { href: '/speaking-course', icon: Mic2, label: 'SG Sprint', badge: 'HOT' },
      { href: '/vocabulary', icon: Library, label: 'Vocabulary SRS' },
      { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { progress, loading } = useProgress();
  const { isCompleted: challengeDone } = useDailyChallenge();
  const { user, logout } = useAuth();
  const [confirmSignOut, setConfirmSignOut] = React.useState(false);

  const completedCount = progress.completedDays.filter(d => d.completed).length;
  const coursePct = Math.round((completedCount / 30) * 100);
  const levelInfo = getLevelInfo(progress.totalXP);
  const levelPct = getLevelProgress(progress.totalXP);
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : '??';

  function isActive(href: string, exact?: boolean, matchPrefix?: string) {
    if (exact) return pathname === href;
    if (matchPrefix) return pathname.startsWith(matchPrefix);
    return pathname === href;
  }

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <Logo href="/app" size="sm" onClick={onClose} />
        <button onClick={onClose} className="lg:hidden text-white/30 hover:text-white/60 p-1 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* XP + Streak stats */}
      {!loading && (
        <div className="px-4 pt-3 pb-2">
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-amber-300 text-xs font-bold">{progress.streak}d</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 flex-1">
              <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              <span className="text-violet-300 text-xs font-bold">{progress.totalXP} XP</span>
            </div>
          </div>

          {/* Level progress */}
          <div className={`mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${levelInfo.bg} border ${levelInfo.border}`}>
            <span className="text-sm leading-none">{levelInfo.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[10px] font-bold ${levelInfo.color}`}>{levelInfo.name}</span>
                <span className="text-[10px] text-white/20">{levelPct}%</span>
              </div>
              <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-current transition-all duration-700"
                  style={{ width: `${levelPct}%`, color: 'currentColor' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-4">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2 mb-1">
              {section}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(item.href, item.exact, item.matchPrefix);
                const Icon = item.icon;
                const showDot = item.showDot && !challengeDone;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group cursor-pointer ${
                      active
                        ? 'bg-violet-500/15 border border-violet-500/25'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        active ? 'text-violet-400' : 'text-white/30 group-hover:text-white/60'
                      }`} />
                      <span className={`text-sm font-medium flex-1 transition-colors ${
                        active ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                      }`}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          item.badge === 'HOT'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {showDot && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                      )}
                    </div>
                  </Link>
                );
              })}
              {section === 'Overview' && user?.role === 'admin' && (
                <Link href="/admin" onClick={onClose}>
                  <div className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group cursor-pointer ${
                    pathname.startsWith('/admin')
                      ? 'bg-amber-500/15 border border-amber-500/25'
                      : 'hover:bg-amber-500/[0.06] border border-transparent'
                  }`}>
                    <Shield className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      pathname.startsWith('/admin') ? 'text-amber-400' : 'text-amber-500/40 group-hover:text-amber-400/70'
                    }`} />
                    <span className={`text-sm font-medium flex-1 transition-colors ${
                      pathname.startsWith('/admin') ? 'text-amber-300' : 'text-amber-500/50 group-hover:text-amber-300/80'
                    }`}>
                      Admin Panel
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
                      ADMIN
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: course progress + user card */}
      <div className="border-t border-white/[0.05]">
        {/* Course progress */}
        {!loading && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-white/25 font-semibold uppercase tracking-wider">Course</span>
              <span className="text-[10px] text-white/25 font-semibold">{completedCount}/30 days</span>
            </div>
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${coursePct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Admin panel link */}
        {user?.role === 'admin' && (
          <div className="px-3 pb-1">
            <Link href="/admin" onClick={onClose}>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors group">
                <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-bold text-amber-300">Admin Panel</span>
              </div>
            </Link>
          </div>
        )}

        {/* Upgrade banner (free users) — hidden on iOS native (Apple 3.1.1: no external purchase links) */}
        {user?.subscription?.status === 'free' && !isNativeIOS() && (
          <div className="px-3 pb-1">
            <Link href="/pricing" onClick={onClose}>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 transition-colors">
                <Crown className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-violet-300 leading-none">Upgrade to Pro</p>
                  <p className="text-[10px] text-violet-400/50 mt-0.5">Unlock all features</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* User card */}
        <div className="px-3 pt-1 pb-3">
          {confirmSignOut ? (
            <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <p className="text-xs text-white/40 text-center">Sign out of EnglishUp?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmSignOut(false)}
                  className="flex-1 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:text-white/60 transition-colors border border-white/[0.07]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setConfirmSignOut(false); onClose(); logout(); }}
                  className="flex-1 py-1.5 rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] group">
              {/* Avatar */}
              <Link href="/profile" onClick={onClose} className="flex-1 flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-[11px] font-black shadow-md shadow-violet-500/20">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/70 truncate leading-none">{user?.name ?? 'User'}</p>
                  <p className="text-[10px] text-white/30 truncate mt-0.5">{user?.email ?? ''}</p>
                </div>
              </Link>
              {/* Sign out button */}
              <button
                onClick={() => setConfirmSignOut(true)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/20 hover:text-white/50 transition-all flex-shrink-0"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-[240px] bg-[#08080e] border-r border-white/[0.06] z-20">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 h-full w-[260px] bg-[#08080e] border-r border-white/[0.06] z-40 flex flex-col"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
