'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Volume2, CheckCircle, AlignLeft, Hash, Shuffle, Mic, Headphones, Grid2X2 } from 'lucide-react';
import { lessons } from '@/lib/lessonData';
import AdminLayout from '@/components/AdminLayout';
import type { Exercise, VocabItem, ExerciseType } from '@/types';

const EXERCISE_TYPE_CONFIG: Record<ExerciseType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  'multiple-choice': { label: 'Multiple Choice', icon: CheckCircle, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  'word-order':      { label: 'Word Order',      icon: Shuffle,      color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
  'fill-blank':      { label: 'Fill Blank',       icon: AlignLeft,    color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
  'listen-choose':   { label: 'Listen & Choose',  icon: Headphones,   color: 'text-emerald-400',bg: 'bg-emerald-500/10'},
  'word-match':      { label: 'Word Match',        icon: Grid2X2,      color: 'text-pink-400',   bg: 'bg-pink-500/10'   },
  'speaking':        { label: 'Speaking',          icon: Mic,          color: 'text-rose-400',   bg: 'bg-rose-500/10'   },
  'pronunciation':   { label: 'Pronunciation',     icon: Volume2,      color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
};

function VocabTable({ items }: { items: VocabItem[] }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
      <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr] text-[10px] font-bold uppercase tracking-wider text-white/25 px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02]">
        <span>Word</span>
        <span>Phonetic</span>
        <span>Translation</span>
        <span>Example</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {items.map((v, i) => (
          <motion.div
            key={v.word}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-[1fr_1fr_1fr_1.5fr] px-4 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-sm font-bold text-white/90">{v.word}</span>
            <span className="text-xs font-mono text-violet-300/70 self-center">{v.phonetic}</span>
            <span className="text-sm text-cyan-300/80 self-center">{v.translation}</span>
            <div className="self-center">
              <p className="text-xs text-white/50 italic">{v.example}</p>
              <p className="text-[11px] text-white/25 mt-0.5">{v.exampleTranslation}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({ ex, index }: { ex: Exercise; index: number }) {
  const cfg = EXERCISE_TYPE_CONFIG[ex.type];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
            <span className="text-[10px] text-white/20 font-mono">#{ex.id}</span>
          </div>
          <p className="text-sm text-white/80 font-medium">{ex.question}</p>
        </div>
      </div>

      {ex.options && (
        <div className="flex flex-wrap gap-1.5 mb-2 ml-11">
          {ex.options.map(opt => (
            <span
              key={opt}
              className={`px-2.5 py-1 rounded-lg text-xs border ${
                opt === ex.correct
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-semibold'
                  : 'bg-white/[0.03] border-white/[0.07] text-white/40'
              }`}
            >
              {opt === ex.correct && <span className="mr-1">✓</span>}
              {opt}
            </span>
          ))}
        </div>
      )}

      {ex.words && (
        <div className="flex flex-wrap gap-1.5 mb-2 ml-11">
          {ex.words.map(w => (
            <span key={w} className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.05] border border-white/[0.08] text-white/60">{w}</span>
          ))}
          <span className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">→ {ex.correct}</span>
        </div>
      )}

      {ex.pairs && (
        <div className="grid grid-cols-2 gap-1.5 mb-2 ml-11">
          {ex.pairs.map(([a, b]) => (
            <div key={a} className="flex items-center gap-1.5 text-xs">
              <span className="text-white/60">{a}</span>
              <span className="text-white/20">—</span>
              <span className="text-cyan-300/70">{b}</span>
            </div>
          ))}
        </div>
      )}

      {ex.audioText && (
        <div className="flex items-center gap-1.5 ml-11 text-xs text-amber-300/70">
          <Volume2 className="w-3 h-3" />
          <span className="italic">{ex.audioText}</span>
        </div>
      )}

      {ex.hint && (
        <p className="ml-11 mt-1.5 text-[11px] text-white/25 italic">Hint: {ex.hint}</p>
      )}
    </motion.div>
  );
}

type Tab = 'vocab' | 'exercises';

const EXERCISE_TYPES: ExerciseType[] = ['multiple-choice', 'word-order', 'fill-blank', 'listen-choose', 'word-match', 'speaking', 'pronunciation'];

export default function AdminLessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('vocab');
  const [typeFilter, setTypeFilter] = useState<ExerciseType | 'all'>('all');

  const day = Number(params.day);
  const lesson = lessons.find(l => l.day === day);

  if (!lesson) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-white/30">Lesson not found.</div>
      </AdminLayout>
    );
  }

  const typeCounts = EXERCISE_TYPES.reduce<Record<string, number>>((acc, t) => {
    acc[t] = lesson.exercises.filter(e => e.type === t).length;
    return acc;
  }, {});

  const filteredExercises = typeFilter === 'all'
    ? lesson.exercises
    : lesson.exercises.filter(e => e.type === typeFilter);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <button
            onClick={() => router.push('/admin/lessons')}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Lessons
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${lesson.gradient[0]}, ${lesson.gradient[1]})` }}
            >
              {lesson.day}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl">{lesson.emoji}</span>
                <h1 className="text-xl font-bold">{lesson.title}</h1>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/30 text-[10px] font-bold uppercase tracking-wider">{lesson.theme}</span>
              </div>
              <p className="text-white/40 text-sm mt-0.5">{lesson.subtitle}</p>
            </div>
            <div className="flex gap-4 text-center flex-shrink-0">
              <div>
                <p className="text-lg font-black text-violet-400">{lesson.vocabulary.length}</p>
                <p className="text-[10px] text-white/25 uppercase tracking-wide">Vocab</p>
              </div>
              <div>
                <p className="text-lg font-black text-cyan-400">{lesson.exercises.length}</p>
                <p className="text-[10px] text-white/25 uppercase tracking-wide">Exercises</p>
              </div>
              <div>
                <p className="text-lg font-black text-amber-400">{lesson.xpReward}</p>
                <p className="text-[10px] text-white/25 uppercase tracking-wide">XP</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 mb-5">
            {(['vocab', 'exercises'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all border ${
                  tab === t
                    ? 'bg-violet-500/15 border-violet-500/25 text-violet-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/60'
                }`}
              >
                {t === 'vocab' ? 'Vocabulary' : 'Exercises'}
                <span className={`ml-1.5 text-[10px] ${tab === t ? 'text-violet-400/70' : 'text-white/20'}`}>
                  {t === 'vocab' ? lesson.vocabulary.length : lesson.exercises.length}
                </span>
              </button>
            ))}
          </div>

          {/* Vocabulary tab */}
          {tab === 'vocab' && <VocabTable items={lesson.vocabulary} />}

          {/* Exercises tab */}
          {tab === 'exercises' && (
            <>
              {/* Type filter */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    typeFilter === 'all'
                      ? 'bg-white/[0.08] border-white/[0.15] text-white/80'
                      : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/60'
                  }`}
                >
                  All <span className="ml-1 text-white/30">{lesson.exercises.length}</span>
                </button>
                {EXERCISE_TYPES.filter(t => typeCounts[t] > 0).map(t => {
                  const cfg = EXERCISE_TYPE_CONFIG[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        typeFilter === t
                          ? `${cfg.bg} border-white/[0.12] ${cfg.color}`
                          : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/60'
                      }`}
                    >
                      {cfg.label} <span className="ml-1 text-white/30">{typeCounts[t]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredExercises.map((ex, i) => (
                  <ExerciseCard key={ex.id} ex={ex} index={i} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
