'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Play, Square, Languages, BookOpen, Volume2, ChevronRight, X } from 'lucide-react';
import { conversations } from '@/lib/conversationData';
import type { Conversation, KeyPhrase } from '@/lib/conversationData';
import { useBadges } from '@/hooks/useBadges';
import AppShell from '@/components/AppShell';

const LEVEL_STYLE: Record<string, string> = {
  B1: 'bg-white/8 text-white/60 border-white/15',
  B2: 'bg-white/12 text-white/80 border-white/25',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const priority = ['Google US English', 'Samantha', 'Karen', 'Zira', 'Eva', 'Hazel', 'Victoria'];
  for (const name of priority) {
    const v = voices.find((v) => v.name.includes(name));
    if (v) return v;
  }
  return voices.find((v) => v.lang === 'en-US' && v.name.toLowerCase().includes('female')) ?? null;
}

function renderWithPhrases(
  text: string,
  keyPhrases: KeyPhrase[],
  onTap: (kp: KeyPhrase) => void
): React.ReactNode {
  if (!keyPhrases.length) return text;
  const escaped = keyPhrases.map((k) => k.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const kp = keyPhrases.find((k) => k.phrase.toLowerCase() === part.toLowerCase());
    if (kp) {
      return (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); onTap(kp); }}
          className="border-b border-dashed border-white/50 hover:border-white transition-colors cursor-pointer font-medium text-white"
        >
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConversationPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? conversations.find((c) => c.id === selectedId) ?? null : null;
  const { trackConversationOpened } = useBadges();

  const handleSelect = useCallback((id: string) => {
    trackConversationOpened();
    setSelectedId(id);
  }, [trackConversationOpened]);

  return (
    <AppShell>
    <div className="text-white overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          {selected ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedId(null)}
              className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          ) : (
            <Link href="/app">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
          )}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <p className="font-bold text-base leading-none">
                {selected ? selected.title : 'Real Conversations'}
              </p>
              <p className="text-white/30 text-xs mt-0.5">
                {selected ? selected.setting : `${conversations.length} real scenarios · B1 – B2`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="player"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            <ConversationPlayer conversation={selected} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.2 }}
          >
            <ConversationList onSelect={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AppShell>
  );
}

// ─── List ──────────────────────────────────────────────────────────────────────

function ConversationList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <main className="max-w-4xl mx-auto px-4 pb-16">
      <section className="py-8 space-y-2">
        <h1 className="text-2xl font-black text-white">How people actually talk</h1>
        <p className="text-white/40 text-sm">
          None of this is in textbooks. This is how people actually communicate in tech environments.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {conversations.map((conv, i) => (
          <motion.button
            key={conv.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(conv.id)}
            className="text-left p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LEVEL_STYLE[conv.level]}`}>
                  {conv.level}
                </span>
                <span className="text-xs text-white/25">{conv.setting}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors flex-shrink-0 mt-0.5" />
            </div>

            <h3 className="font-bold text-white text-sm mb-1">"{conv.title}"</h3>
            <p className="text-white/40 text-xs leading-relaxed mb-3">{conv.context}</p>

            <div className="flex items-center gap-3 text-xs text-white/25">
              <span>{conv.lines.length} lines</span>
              <span>·</span>
              <span>{conv.keyPhrases.length} key phrases</span>
            </div>
          </motion.button>
        ))}
      </div>
    </main>
  );
}

// ─── Player ────────────────────────────────────────────────────────────────────

function ConversationPlayer({ conversation }: { conversation: Conversation }) {
  const [showTranslations, setShowTranslations] = useState(false);
  const [activePhrase, setActivePhrase] = useState<KeyPhrase | null>(null);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const autoPlayRef = useRef(false);

  const speakLine = useCallback((text: string, idx: number, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.82;
    utter.pitch = 1.05;
    utter.lang = 'en-US';
    const voice = pickFemaleVoice();
    if (voice) utter.voice = voice;
    utter.onstart = () => setPlayingIdx(idx);
    utter.onend = () => {
      setPlayingIdx(null);
      onEnd?.();
    };
    window.speechSynthesis.speak(utter);
  }, []);

  const stopAll = useCallback(() => {
    autoPlayRef.current = false;
    window.speechSynthesis.cancel();
    setIsAutoPlaying(false);
    setPlayingIdx(null);
  }, []);

  const autoPlay = useCallback(() => {
    if (isAutoPlaying) { stopAll(); return; }
    autoPlayRef.current = true;
    setIsAutoPlaying(true);
    let idx = 0;
    const next = () => {
      if (!autoPlayRef.current || idx >= conversation.lines.length) {
        autoPlayRef.current = false;
        setIsAutoPlaying(false);
        setPlayingIdx(null);
        return;
      }
      const i = idx++;
      speakLine(conversation.lines[i].text, i, () => {
        if (autoPlayRef.current) setTimeout(next, 450);
      });
    };
    next();
  }, [isAutoPlaying, conversation, speakLine, stopAll]);

  useEffect(() => () => { autoPlayRef.current = false; window.speechSynthesis.cancel(); }, []);

  return (
    <main className="max-w-2xl mx-auto px-4 pb-32 pt-4 relative">
      {/* Context bar */}
      <div className="mb-6 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-white/40">
        <span className="text-white/60 font-medium">Context: </span>{conversation.context}
      </div>

      {/* Chat bubbles */}
      <div className="space-y-3">
        {conversation.lines.map((line, i) => {
          const isA = line.speaker === 'A';
          const isPlaying = playingIdx === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex gap-3 ${isA ? 'justify-start' : 'justify-end'}`}
            >
              {isA && (
                <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-xs font-bold text-white/50 flex-shrink-0 mt-1">
                  {line.name[0]}
                </div>
              )}
              <div className={`max-w-[80%] space-y-1 ${isA ? '' : 'items-end flex flex-col'}`}>
                <p className={`text-[10px] text-white/25 ${isA ? 'ml-0.5' : 'mr-0.5'}`}>{line.name}</p>
                <button
                  onClick={() => speakLine(line.text, i)}
                  className={`group text-left px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all ${
                    isA
                      ? 'bg-white/[0.07] border border-white/[0.08] text-white/80 rounded-tl-sm'
                      : 'bg-white/[0.12] border border-white/[0.15] text-white rounded-tr-sm'
                  } ${isPlaying ? 'ring-1 ring-white/30' : ''}`}
                >
                  <span className="relative">
                    {renderWithPhrases(line.text, conversation.keyPhrases, setActivePhrase)}
                    {isPlaying && (
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-white align-middle"
                      />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {showTranslations && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-xs text-white/30 italic px-1 ${isA ? '' : 'text-right'}`}
                    >
                      {line.translation}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              {!isA && (
                <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-xs font-bold text-white/50 flex-shrink-0 mt-1">
                  {line.name[0]}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Key phrase tooltip */}
      <AnimatePresence>
        {activePhrase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 flex items-end justify-center px-4"
            onClick={() => setActivePhrase(null)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mb-4 p-5 rounded-2xl bg-[#111] border border-white/15 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-white font-bold text-lg">"{activePhrase.phrase}"</p>
                <button onClick={() => setActivePhrase(null)} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{activePhrase.meaning}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phrases drawer */}
      <AnimatePresence>
        {showPhrases && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 flex items-end justify-center px-4"
            onClick={() => setShowPhrases(false)}
          >
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mb-4 rounded-2xl bg-[#111] border border-white/10 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <p className="font-bold text-white text-sm">Key Phrases ({conversation.keyPhrases.length})</p>
                <button onClick={() => setShowPhrases(false)} className="text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
                {conversation.keyPhrases.map((kp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium">"{kp.phrase}"</p>
                      <p className="text-white/45 text-xs mt-0.5 leading-relaxed">{kp.meaning}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/[0.07]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={autoPlay}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isAutoPlaying
                ? 'bg-white text-black'
                : 'bg-white/8 border border-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            {isAutoPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoPlaying ? 'Stop' : 'Play All'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowTranslations((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
              showTranslations
                ? 'bg-white/15 border border-white/20 text-white'
                : 'bg-white/5 border border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Translate</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowPhrases(true)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/8 text-white/40 hover:text-white/70 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phrases</span>
          </motion.button>

          <div className="flex-1 text-right">
            <p className="text-white/20 text-xs">Tap any bubble to hear it</p>
          </div>
        </div>
      </div>
    </main>
  );
}
