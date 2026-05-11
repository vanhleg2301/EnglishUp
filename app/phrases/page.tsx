'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Volume2, RotateCcw, ChevronRight, BookOpen, Zap } from 'lucide-react';
import { phrases, categoryMeta, typeLabels, CATEGORIES } from '@/lib/phrasesData';
import type { Phrase, PhraseCategory } from '@/lib/phrasesData';

function speakText(text: string) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.8;
  utter.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const pref = ['Google US English', 'Samantha', 'Zira', 'Karen'];
  const voice = voices.find((v) => pref.some((p) => v.name.includes(p))) ?? voices.find((v) => v.lang === 'en-US') ?? null;
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

// ── Flip Card ─────────────────────────────────────────────────────────────
function PhraseCard({ phrase: p }: { phrase: Phrase }) {
  const [flipped, setFlipped] = useState(false);
  const meta = categoryMeta[p.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: 1000 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!flipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: -8, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07] transition-colors p-4 min-h-[130px] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${meta.color}25`, color: meta.color }}
                >
                  {typeLabels[p.type]}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); speakText(p.phrase); }}
                  className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-white font-bold text-base leading-snug">{p.phrase}</p>
            </div>
            <p className="text-white/25 text-xs mt-2">Nhấp để xem nghĩa →</p>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 8, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl border p-4 min-h-[130px] flex flex-col gap-2.5"
            style={{ borderColor: `${meta.color}40`, background: `${meta.color}0a` }}
          >
            <div className="flex items-start justify-between">
              <p className="font-bold text-sm" style={{ color: meta.color }}>{p.translation}</p>
              <button
                onClick={(e) => { e.stopPropagation(); speakText(p.phrase); }}
                className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 ml-2"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-white/60 text-xs leading-relaxed italic">"{p.examples[0].en}"</p>
            <p className="text-white/30 text-xs leading-relaxed">{p.examples[0].vi}</p>
            {p.notes && (
              <p className="text-amber-400/60 text-[10px] leading-relaxed border-t border-white/5 pt-2">
                💡 {p.notes}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Practice Mode ─────────────────────────────────────────────────────────
function PracticeMode({ items, onExit }: { items: Phrase[]; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [review, setReview] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  const current = items[index];
  const meta = categoryMeta[current?.category ?? 'office'];
  const progress = ((index) / items.length) * 100;

  const handleGotIt = useCallback(() => {
    setKnown((prev) => new Set(prev).add(current.id));
    if (index < items.length - 1) {
      setIndex((i) => i + 1);
      setRevealed(false);
    } else {
      setDone(true);
    }
  }, [current, index, items.length]);

  const handleReview = useCallback(() => {
    setReview((prev) => new Set(prev).add(current.id));
    if (index < items.length - 1) {
      setIndex((i) => i + 1);
      setRevealed(false);
    } else {
      setDone(true);
    }
  }, [current, index, items.length]);

  const handleRestart = () => {
    setIndex(0);
    setRevealed(false);
    setKnown(new Set());
    setReview(new Set());
    setDone(false);
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-12 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/30">
          🎉
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white">Xong rồi!</h2>
          <p className="text-white/40 text-sm">{items.length} cụm từ đã ôn</p>
        </div>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-3xl font-black text-emerald-400">{known.size}</p>
            <p className="text-white/40 text-xs mt-0.5">Đã thuộc</p>
          </div>
          <div>
            <p className="text-3xl font-black text-amber-400">{review.size}</p>
            <p className="text-white/40 text-xs mt-0.5">Cần ôn thêm</p>
          </div>
        </div>
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Lại từ đầu
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white text-sm"
          >
            Xong
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/30">
          <span>{index + 1} / {items.length}</span>
          <span>{known.size} đã thuộc</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120 }}
          />
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + revealed}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 min-h-[280px] flex flex-col justify-center gap-4"
        >
          <div className="flex items-start justify-between">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${meta.color}25`, color: meta.color }}
            >
              {meta.emoji} {meta.label}
            </span>
            <button
              onClick={() => speakText(current.phrase)}
              className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-3xl font-black text-white leading-snug">{current.phrase}</p>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-lg font-bold" style={{ color: meta.color }}>{current.translation}</p>

                <div className="space-y-2">
                  {current.examples.map((ex, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/8 space-y-1">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => speakText(ex.en)}
                          className="text-white/20 hover:text-white/60 transition-colors mt-0.5 flex-shrink-0"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <p className="text-white/75 text-sm leading-relaxed">{ex.en}</p>
                      </div>
                      <p className="text-white/35 text-xs leading-relaxed pl-5">{ex.vi}</p>
                    </div>
                  ))}
                </div>

                {current.notes && (
                  <p className="text-amber-400/60 text-xs leading-relaxed">💡 {current.notes}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      {!revealed ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setRevealed(true)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white flex items-center justify-center gap-2"
        >
          Xem nghĩa <ChevronRight className="w-5 h-5" />
        </motion.button>
      ) : (
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleReview}
            className="flex-1 py-4 rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 text-amber-300 font-bold text-sm"
          >
            Ôn thêm
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGotIt}
            className="flex-1 py-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-bold text-sm"
          >
            Thuộc rồi ✓
          </motion.button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
type Tab = 'browse' | 'practice';

export default function PhrasesPage() {
  const [activeCategory, setActiveCategory] = useState<PhraseCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [practiceKey, setPracticeKey] = useState(0);

  const filtered = activeCategory === 'all'
    ? phrases
    : phrases.filter((p) => p.category === activeCategory);

  const groupedBrowse: Record<PhraseCategory, Phrase[]> = {
    office: [], tech: [], meeting: [], email: [], smalltalk: [],
  };
  filtered.forEach((p) => groupedBrowse[p.category].push(p));

  const startPractice = () => {
    setPracticeKey((k) => k + 1);
    setActiveTab('practice');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/app">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-base leading-none">Phrases & Chunks</p>
              <p className="text-white/35 text-xs mt-0.5">{phrases.length} cụm từ thực tế · office, tech, email</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {(['browse', 'practice'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => tab === 'practice' ? startPractice() : setActiveTab('browse')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white text-black'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {tab === 'browse' ? 'Browse' : 'Luyện'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'browse' ? (
            <motion.div
              key="browse"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Intro */}
              <section className="py-6 space-y-1.5">
                <p className="text-white/40 text-sm max-w-lg leading-relaxed">
                  Học theo cụm — collocations, phrasal verbs, idioms và expressions thực tế trong môi trường tech. Nhấp vào card để xem nghĩa và ví dụ.
                </p>
                <div className="flex items-center gap-2 text-white/25 text-xs">
                  <Zap className="w-3 h-3" />
                  <span>Chứa {phrases.length} cụm từ từ 5 nhóm chủ đề</span>
                </div>
              </section>

              {/* Category filter */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                    activeCategory === 'all'
                      ? 'bg-white/15 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                  }`}
                >
                  🌐 Tất cả ({phrases.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const meta = categoryMeta[cat];
                  const count = phrases.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                        activeCategory === cat
                          ? 'border-white/30 text-white'
                          : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                      }`}
                      style={activeCategory === cat ? { background: `${meta.color}20`, borderColor: `${meta.color}50`, color: meta.color } : {}}
                    >
                      <span>{meta.emoji}</span>
                      <span>{meta.label} ({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Cards */}
              {activeCategory === 'all' ? (
                <div className="space-y-10">
                  {CATEGORIES.map((cat) => {
                    const meta = categoryMeta[cat];
                    const catPhrases = groupedBrowse[cat];
                    if (!catPhrases.length) return null;
                    return (
                      <section key={cat}>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg">{meta.emoji}</span>
                          <h2 className="font-bold text-white text-sm">{meta.label}</h2>
                          <span className="text-white/20 text-xs">({catPhrases.length})</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {catPhrases.map((p) => <PhraseCard key={p.id} phrase={p} />)}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filtered.map((p) => <PhraseCard key={p.id} phrase={p} />)}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`practice-${practiceKey}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="pt-6 max-w-lg mx-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-white/40 text-sm">Luyện tập · {filtered.length} cụm từ</p>
                <div className="flex gap-2">
                  {CATEGORIES.map((cat) => {
                    const meta = categoryMeta[cat];
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setPracticeKey((k) => k + 1); }}
                        title={meta.label}
                        className={`w-7 h-7 rounded-lg border text-xs transition-all ${
                          isActive
                            ? 'border-white/30 bg-white/15 text-white'
                            : 'border-white/10 bg-white/5 text-white/30 hover:text-white/60'
                        }`}
                      >
                        {meta.emoji}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => { setActiveCategory('all'); setPracticeKey((k) => k + 1); }}
                    className={`px-2 h-7 rounded-lg border text-[10px] font-bold transition-all ${
                      activeCategory === 'all'
                        ? 'border-white/30 bg-white/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/30 hover:text-white/60'
                    }`}
                  >
                    ALL
                  </button>
                </div>
              </div>
              <PracticeMode
                key={`pm-${practiceKey}-${activeCategory}`}
                items={activeCategory === 'all' ? phrases : phrases.filter((p) => p.category === activeCategory)}
                onExit={() => setActiveTab('browse')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
