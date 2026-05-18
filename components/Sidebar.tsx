'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid, BookOpen, Bot, Layers,
  MessageSquare, Music2, Target, Flame, Zap, LogOut, X,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
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
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { progress, loading } = useProgress();
  const { isCompleted: challengeDone } = useDailyChallenge();
  const [confirmSignOut, setConfirmSignOut] = React.useState(false);

  const completedCount = progress.completedDays.filter(d => d.completed).length;
  const progressPct = Math.round((completedCount / 30) * 100);

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

      {/* Stats */}
      {!loading && (
        <div className="px-4 py-2.5 flex gap-2 border-b border-white/[0.05]">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-1 min-w-0">
            <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-amber-300 text-xs font-bold truncate">{progress.streak} streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 flex-1 min-w-0">
            <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <span className="text-violet-300 text-xs font-bold truncate">{progress.totalXP} XP</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2 mb-1.5">
              {section}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(item.href, item.exact, item.matchPrefix);
                const Icon = item.icon;
                const showDot = item.showDot && !challengeDone;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
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
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex-shrink-0">
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
            </div>
          </div>
        ))}
      </nav>

      {/* Progress */}
      {!loading && (
        <div className="px-4 py-3 border-t border-white/[0.05]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/25 font-semibold">Course Progress</span>
            <span className="text-[10px] text-white/25 font-semibold">{progressPct}%</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-white/20 mt-1">{completedCount}/30 days done</p>
        </div>
      )}

      {/* Sign out */}
      <div className="px-3 py-3 border-t border-white/[0.05]">
        {confirmSignOut ? (
          <div className="px-3 py-2 space-y-2">
            <p className="text-xs text-white/40">Sign out?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmSignOut(false)}
                className="flex-1 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
              <Link href="/auth/login" onClick={onClose} className="flex-1">
                <div className="py-1.5 rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 text-xs text-center hover:bg-red-500/25 transition-colors">
                  Sign out
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmSignOut(true)} className="w-full">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-all group cursor-pointer">
              <LogOut className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
              <span className="text-sm text-white/25 group-hover:text-white/50 transition-colors">Sign out</span>
            </div>
          </button>
        )}
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
