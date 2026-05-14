'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Layers, ChevronRight } from 'lucide-react';
import { shadowingItems, levelColors, categoryLabels } from '@/lib/shadowingData';
import type { ShadowLevel, ShadowCategory, ShadowingItem } from '@/lib/shadowingData';
import ShadowingPlayer from '@/components/shadowing/ShadowingPlayer';
import AppShell from '@/components/AppShell';

const LEVELS: ShadowLevel[] = ['A2', 'B1', 'B2', 'C1'];
const CATEGORIES: (ShadowCategory | 'all')[] = ['all', 'office', 'travel', 'daily', 'business'];

const categoryAllLabel = { label: 'All', emoji: '🌐' };

const levelDescriptions: Record<ShadowLevel, string> = {
  A2: 'start here if you\'re new to shadowing',
  B1: 'longer, more natural sentences closer to real speech',
  B2: 'ready for professional environments',
  C1: 'advanced — system design, negotiations, high-stakes talk',
};

export default function ShadowingPage() {
  const [activeLevel, setActiveLevel] = useState<ShadowLevel>('A2');
  const [activeCategory, setActiveCategory] = useState<ShadowCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<ShadowingItem | null>(null);

  const filtered = shadowingItems.filter(
    (item) =>
      item.level === activeLevel &&
      (activeCategory === 'all' || item.category === activeCategory)
  );

  return (
    <AppShell>
    <div className="text-white overflow-x-hidden relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/app">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-lg leading-none">Shadowing</p>
              <p className="text-white/40 text-xs">listen, shadow, record — that's the whole method</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.22 }}
              className="pt-6"
            >
              <ShadowingPlayer
                item={selectedItem}
                onBack={() => setSelectedItem(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.22 }}
            >
              {/* Hero */}
              <section className="pt-8 pb-6 text-center space-y-3">
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  Practice{' '}
                  <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Shadowing
                  </span>
                </h1>
                <p className="text-white/40 text-sm max-w-sm mx-auto">
                  Listen, mimic, play it back. Repetitive, yes — but it's how fluent speakers actually get there.
                </p>
              </section>

              {/* Level Tabs */}
              <div className="flex gap-3 mb-6 overflow-x-auto pb-1 scrollbar-none">
                {LEVELS.map((level) => {
                  const colors = levelColors[level];
                  const active = activeLevel === level;
                  return (
                    <motion.button
                      key={level}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveLevel(level)}
                      className={`flex-shrink-0 px-5 py-3 rounded-2xl border font-bold text-sm transition-all ${
                        active
                          ? 'border-transparent text-white'
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                      }`}
                      style={active ? { background: `linear-gradient(135deg, ${colors.gradient[0]}, ${colors.gradient[1]})`, boxShadow: `0 4px 20px ${colors.gradient[0]}40` } : {}}
                    >
                      <span className={`text-xs font-black tracking-widest ${active ? 'text-white' : colors.text}`}>{level}</span>
                      {active && (
                        <p className="text-white/70 font-normal text-xs mt-0.5">{levelDescriptions[level]}</p>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const info = cat === 'all' ? categoryAllLabel : categoryLabels[cat];
                  return (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                        activeCategory === cat
                          ? 'bg-white/15 border-white/30 text-white'
                          : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                      }`}
                    >
                      <span>{info.emoji}</span>
                      <span>{info.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.length === 0 ? (
                  <div className="col-span-2 py-16 text-center text-white/30">
                    <p className="text-4xl mb-3">🔍</p>
                    <p>No sentences in this category.</p>
                  </div>
                ) : (
                  filtered.map((item, i) => (
                    <ShadowCard
                      key={item.id}
                      item={item}
                      index={i}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
    </AppShell>
  );
}

function ShadowCard({
  item,
  index,
  onClick,
}: {
  item: ShadowingItem;
  index: number;
  onClick: () => void;
}) {
  const colors = levelColors[item.level];
  const catInfo = categoryLabels[item.category];
  const wordCount = item.text.split(' ').length;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left w-full relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:border-white/20 transition-all p-5 group"
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl opacity-70"
        style={{ background: `linear-gradient(90deg, ${colors.gradient[0]}, ${colors.gradient[1]})` }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full tracking-widest"
            style={{ background: `${colors.gradient[0]}25`, color: colors.gradient[0] }}
          >
            {item.level}
          </span>
          <span className="text-xs text-white/30">
            {catInfo.emoji} {catInfo.label}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
      </div>

      {/* Title */}
      <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>

      {/* Text preview */}
      <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{item.text}</p>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-white/25 text-xs">{wordCount} words</span>
        {item.tip && (
          <>
            <span className="text-white/15 text-xs">•</span>
            <span className="text-white/25 text-xs truncate">Tip: {item.tip.slice(0, 30)}…</span>
          </>
        )}
      </div>
    </motion.button>
  );
}
