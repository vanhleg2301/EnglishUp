'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Volume2, AlertTriangle } from 'lucide-react';
import AppShell from '@/components/AppShell';

type Group = 'vowels' | 'diphthongs' | 'consonants';

interface Phoneme {
  symbol: string;
  keyword: string;
  words: string[];
  tip?: string;
  tricky?: boolean;
}

const VOWELS: Phoneme[] = [
  { symbol: '/iː/', keyword: 'see', words: ['team', 'feet', 'machine'], tip: 'Long and tense — stretch the corners of your mouth like you\'re smiling' },
  { symbol: '/ɪ/', keyword: 'sit', words: ['build', 'busy', 'England'], tip: 'Short and relaxed — NOT the same as /iː/', tricky: true },
  { symbol: '/e/', keyword: 'bed', words: ['said', 'head', 'friend'] },
  { symbol: '/æ/', keyword: 'cat', words: ['bad', 'plan', 'app'], tip: 'Open your mouth wide and spread the corners — this sound doesn\'t exist in Vietnamese', tricky: true },
  { symbol: '/ɑː/', keyword: 'car', words: ['large', 'start', 'party'] },
  { symbol: '/ɒ/', keyword: 'hot', words: ['watch', 'block', 'job'], tip: 'Many Americans pronounce this almost like /ɑː/' },
  { symbol: '/ɔː/', keyword: 'door', words: ['more', 'talk', 'thought'] },
  { symbol: '/ʊ/', keyword: 'book', words: ['look', 'pull', 'could'], tip: 'Short and rounded — NOT the long /uː/ in "food"', tricky: true },
  { symbol: '/uː/', keyword: 'food', words: ['move', 'blue', 'loop'] },
  { symbol: '/ʌ/', keyword: 'cup', words: ['love', 'blood', 'done'], tip: 'A flat, neutral "uh" sound — often confused with /æ/. Lips stay relaxed', tricky: true },
  { symbol: '/ɜː/', keyword: 'bird', words: ['word', 'heard', 'work'], tip: 'Unique to English — lips stay completely neutral, not rounded at all', tricky: true },
  { symbol: '/ə/', keyword: 'about', words: ['the', 'button', 'banana'], tip: 'Schwa — the MOST common sound in English. Unstressed syllables, completely relaxed', tricky: true },
];

const DIPHTHONGS: Phoneme[] = [
  { symbol: '/eɪ/', keyword: 'day', words: ['say', 'face', 'great'] },
  { symbol: '/aɪ/', keyword: 'my', words: ['time', 'find', 'write'] },
  { symbol: '/ɔɪ/', keyword: 'boy', words: ['coin', 'voice', 'choice'] },
  { symbol: '/aʊ/', keyword: 'now', words: ['house', 'found', 'town'] },
  { symbol: '/əʊ/', keyword: 'go', words: ['home', 'code', 'open'], tip: 'Americans typically say /oʊ/ — lips round more toward the end' },
  { symbol: '/ɪə/', keyword: 'near', words: ['here', 'clear', 'idea'], tricky: true },
  { symbol: '/eə/', keyword: 'there', words: ['where', 'care', 'share'], tricky: true },
  { symbol: '/ʊə/', keyword: 'pure', words: ['cure', 'tour', 'sure'], tip: 'Increasingly rare — many speakers replace it with /ɔː/' },
];

const CONSONANTS: Phoneme[] = [
  { symbol: '/p/', keyword: 'pin', words: ['stop', 'happy', 'app'] },
  { symbol: '/b/', keyword: 'bin', words: ['job', 'table', 'pub'] },
  { symbol: '/t/', keyword: 'tin', words: ['sit', 'letter', 'bit'] },
  { symbol: '/d/', keyword: 'din', words: ['bad', 'idea', 'odd'] },
  { symbol: '/k/', keyword: 'cat', words: ['block', 'quick', 'code'] },
  { symbol: '/ɡ/', keyword: 'got', words: ['big', 'debug', 'flag'] },
  { symbol: '/f/', keyword: 'fat', words: ['off', 'phone', 'if'] },
  { symbol: '/v/', keyword: 'vat', words: ['live', 'verb', 'review'], tip: 'Upper teeth on lower lip — NOT like the Vietnamese /b/', tricky: true },
  { symbol: '/θ/', keyword: 'think', words: ['both', 'three', 'through'], tip: 'Tongue between your teeth, breathe out — this sound doesn\'t exist in Vietnamese', tricky: true },
  { symbol: '/ð/', keyword: 'this', words: ['other', 'then', 'smooth'], tip: 'Like /θ/ but voiced — vocal cords vibrate. Used in "the", "that", "them"', tricky: true },
  { symbol: '/s/', keyword: 'see', words: ['bus', 'class', 'basic'] },
  { symbol: '/z/', keyword: 'zoo', words: ['has', 'was', 'because'] },
  { symbol: '/ʃ/', keyword: 'ship', words: ['push', 'action', 'wish'] },
  { symbol: '/ʒ/', keyword: 'vision', words: ['usual', 'measure', 'casual'], tip: 'Rare — mostly in the middle of words: "decision", "vision", "version"' },
  { symbol: '/h/', keyword: 'hat', words: ['ahead', 'whole', 'behind'] },
  { symbol: '/tʃ/', keyword: 'chip', words: ['watch', 'catch', 'branch'] },
  { symbol: '/dʒ/', keyword: 'job', words: ['judge', 'bridge', 'merge'] },
  { symbol: '/m/', keyword: 'man', words: ['some', 'commit', 'team'] },
  { symbol: '/n/', keyword: 'now', words: ['ten', 'function', 'run'] },
  { symbol: '/ŋ/', keyword: 'sing', words: ['think', 'ring', 'string'], tip: 'The -ng ending — tongue on roof of mouth, do NOT open further or add a /g/ sound', tricky: true },
  { symbol: '/l/', keyword: 'leg', words: ['fill', 'pull', 'null'] },
  { symbol: '/r/', keyword: 'red', words: ['very', 'write', 'error'], tip: 'Tongue touches nothing, curls slightly inward — very different from the Vietnamese /r/', tricky: true },
  { symbol: '/j/', keyword: 'yes', words: ['use', 'you', 'yarn'] },
  { symbol: '/w/', keyword: 'we', words: ['away', 'web', 'switch'] },
];

const GROUP_DATA: Record<Group, { label: string; count: number; phonemes: Phoneme[] }> = {
  vowels: { label: 'Vowels', count: VOWELS.length, phonemes: VOWELS },
  diphthongs: { label: 'Diphthongs', count: DIPHTHONGS.length, phonemes: DIPHTHONGS },
  consonants: { label: 'Consonants', count: CONSONANTS.length, phonemes: CONSONANTS },
};

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const priority = ['Google US English', 'Samantha', 'Karen', 'Zira', 'Eva', 'Victoria'];
  for (const name of priority) {
    const v = voices.find((v) => v.name.includes(name));
    if (v) return v;
  }
  return voices.find((v) => v.lang === 'en-US') ?? null;
}

export default function AlphabetPage() {
  const [activeGroup, setActiveGroup] = useState<Group>('vowels');
  const [selected, setSelected] = useState<Phoneme | null>(null);

  const speak = useCallback((text: string, rate = 0.75) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = 1.05;
    utter.lang = 'en-US';
    const voice = pickFemaleVoice();
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  }, []);

  const { phonemes } = GROUP_DATA[activeGroup];
  const trickyCount = phonemes.filter((p) => p.tricky).length;

  return (
    <AppShell>
    <div className="text-white overflow-x-hidden">
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
          <div>
            <p className="font-bold text-base leading-none">English Phonetics</p>
            <p className="text-white/30 text-xs mt-0.5">44 real sounds · not just 26 letters</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <section className="py-6 space-y-1">
          <p className="text-white/40 text-sm max-w-lg">
            The 26 letters you grew up with aren't enough for accurate pronunciation. English has 44 distinct sounds — that's why you get misheard even when you spell things right.
          </p>
        </section>

        {/* Group tabs */}
        <div className="flex gap-2 mb-8">
          {(Object.keys(GROUP_DATA) as Group[]).map((group) => {
            const { label, count } = GROUP_DATA[group];
            const active = activeGroup === group;
            return (
              <motion.button
                key={group}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveGroup(group)}
                className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  active
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/15'
                }`}
              >
                <span>{label}</span>
                <span className={`text-xs ${active ? 'text-black/50' : 'text-white/25'}`}>({count})</span>
              </motion.button>
            );
          })}
        </div>

        {trickyCount > 0 && (
          <div className="mb-6 flex items-center gap-2 text-xs text-white/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500/60" />
            <span>
              <span className="text-amber-500/80 font-semibold">{trickyCount} tricky sounds</span> — commonly mispronounced by Vietnamese learners
            </span>
          </div>
        )}

        {/* Phoneme grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGroup}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {phonemes.map((p, i) => (
              <motion.button
                key={p.symbol}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setSelected(p); speak(p.keyword); }}
                className={`text-left p-4 rounded-xl border transition-all group ${
                  p.tricky
                    ? 'bg-amber-500/5 border-amber-500/15 hover:border-amber-500/30'
                    : 'bg-white/[0.03] border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-2xl font-black font-mono ${p.tricky ? 'text-amber-300/80' : 'text-white/90'}`}>
                    {p.symbol}
                  </span>
                  <div className="flex items-center gap-1">
                    {p.tricky && <AlertTriangle className="w-3 h-3 text-amber-500/60" />}
                    <Volume2 className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </div>
                <p className="text-white/70 text-sm font-semibold">{p.keyword}</p>
                <p className="text-white/25 text-xs mt-0.5 truncate">{p.words.slice(0, 2).join(', ')}</p>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center px-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm mb-4 sm:mb-0 p-6 rounded-2xl bg-[#111] border border-white/15 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black font-mono text-white">{selected.symbol}</span>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => speak(selected.keyword, 0.65)}
                  className="p-3 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </motion.button>
              </div>

              <div>
                <p className="text-white text-xl font-bold">{selected.keyword}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selected.words.map((w) => (
                    <button
                      key={w}
                      onClick={() => speak(w)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/25 transition-all"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {selected.tip && (
                <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                  selected.tricky
                    ? 'bg-amber-500/8 border border-amber-500/20 text-amber-200/70'
                    : 'bg-white/5 border border-white/8 text-white/50'
                }`}>
                  {selected.tricky && <p className="text-amber-400/80 font-semibold text-xs mb-1">Note</p>}
                  {selected.tip}
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 rounded-xl bg-white/8 border border-white/10 text-white/60 text-sm hover:bg-white/15 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </AppShell>
  );
}
