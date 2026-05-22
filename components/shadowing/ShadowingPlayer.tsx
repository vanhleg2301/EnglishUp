'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Gauge, Repeat,
  Mic, MicOff, ChevronLeft, Lightbulb,
  Target, TrendingUp, ZoomIn,
} from 'lucide-react';
import { useTTS, useLiveSpeechRecognition, scorePronunciation } from '@/hooks/useSpeech';
import { useBadges } from '@/hooks/useBadges';
import { getWordGuide } from '@/lib/pronunciationGuide';
import WordPopup from '@/components/shadowing/WordPopup';
import type { ShadowingItem } from '@/lib/shadowingData';
import { levelColors } from '@/lib/shadowingData';

interface Props {
  item: ShadowingItem;
  onBack: () => void;
}

type PlayState = 'idle' | 'playing' | 'paused' | 'shadowing' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';

const SPEEDS = [0.6, 0.8, 1.0, 1.2] as const;
const SPEED_LABELS = ['0.6×', '0.8×', '1.0×', '1.2×'];

function loadAttempts(itemId: string): number[] {
  try {
    const raw = localStorage.getItem(`eng-shadow-attempts-${itemId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAttempt(itemId: string, score: number): number[] {
  const prev = loadAttempts(itemId);
  const next = [...prev, score].slice(-3);
  try { localStorage.setItem(`eng-shadow-attempts-${itemId}`, JSON.stringify(next)); } catch {}
  return next;
}

function loadDifficulty(itemId: string): Difficulty | null {
  try { return localStorage.getItem(`eng-shadow-difficulty-${itemId}`) as Difficulty | null; }
  catch { return null; }
}

function saveDifficulty(itemId: string, d: Difficulty) {
  try { localStorage.setItem(`eng-shadow-difficulty-${itemId}`, d); } catch {}
}

function speakFocusWord(text: string, rate: number) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = rate;
  utter.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const prefs = ['Google US English', 'Samantha', 'Zira', 'Karen', 'Eva'];
  const v = voices.find((v) => prefs.some((p) => v.name.includes(p))) ?? voices.find((v) => v.lang === 'en-US') ?? null;
  if (v) utter.voice = v;
  window.speechSynthesis.speak(utter);
}

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-5 flex-shrink-0">
      {[5, 8, 12, 7, 10, 6, 9, 5, 11, 7].map((h, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-white/40"
          animate={active ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.3 }}
          transition={active ? { repeat: Infinity, duration: 0.5 + i * 0.04, delay: i * 0.05 } : {}}
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

export default function ShadowingPlayer({ item, onBack }: Props) {
  const words = item.text.split(/\s+/);
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [speedIdx, setSpeedIdx] = useState(1);
  const [loop, setLoop] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [shadowResult, setShadowResult] = useState<{ score: number; results: { word: string; matched: boolean }[] } | null>(null);
  const [shadowHeard, setShadowHeard] = useState('');
  const [accentCoachOpen, setAccentCoachOpen] = useState(false);
  const [attempts, setAttempts] = useState<number[]>(() => loadAttempts(item.id));
  const [difficulty, setDifficulty] = useState<Difficulty | null>(() => loadDifficulty(item.id));

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { speak, stop } = useTTS();
  const { startListening, stopListening } = useLiveSpeechRecognition();
  const [liveTranscript, setLiveTranscript] = useState('');
  const { trackShadowingScore, trackB2Complete } = useBadges();
  const colors = levelColors[item.level];

  const playWithHighlight = useCallback(() => {
    if (typeof window === 'undefined') return;
    stop();
    setActiveWord(null);
    setPlayState('playing');

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = 'en-US';
    utterance.rate = SPEEDS[speedIdx];
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const femPrefs = ['Google US English', 'Samantha', 'Zira', 'Karen', 'Eva', 'Moira', 'Hazel'];
    const enVoices = voices.filter((v) => v.lang.startsWith('en'));
    let picked: SpeechSynthesisVoice | undefined;
    for (const p of femPrefs) {
      picked = enVoices.find((v) => v.name.includes(p));
      if (picked) break;
    }
    if (picked) utterance.voice = picked;

    const offsets: number[] = [];
    let pos = 0;
    words.forEach((w) => {
      const idx = item.text.indexOf(w, pos);
      offsets.push(idx);
      pos = idx + w.length;
    });

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const wi = offsets.findLastIndex((off) => off <= e.charIndex);
        if (wi >= 0) setActiveWord(wi);
      }
    };

    utterance.onend = () => {
      setActiveWord(null);
      if (loop) {
        setTimeout(() => playWithHighlight(), 800);
      } else {
        setPlayState('idle');
      }
    };

    utterance.onerror = () => {
      setPlayState('idle');
      setActiveWord(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [item.text, words, speedIdx, loop, stop]);

  const handlePlayPause = () => {
    if (playState === 'playing') {
      window.speechSynthesis?.pause();
      setPlayState('paused');
    } else if (playState === 'paused') {
      window.speechSynthesis?.resume();
      setPlayState('playing');
    } else {
      playWithHighlight();
    }
  };

  const handleRepeat = () => {
    setShadowResult(null);
    setShadowHeard('');
    setPlayState('idle');
    setTimeout(() => playWithHighlight(), 50);
  };

  const handleReset = () => {
    stop();
    setActiveWord(null);
    setPlayState('idle');
    setShadowResult(null);
    setShadowHeard('');
    setAccentCoachOpen(false);
  };

  const handleShadow = () => {
    if (playState === 'shadowing') {
      stopListening();
      setPlayState('idle');
      return;
    }
    stop();
    setPlayState('playing');
    speak(item.text, SPEEDS[speedIdx]);
    const wordCount = words.length;
    const dur = (wordCount * 0.5 / SPEEDS[speedIdx]) * 1000 + 1500;
    setTimeout(() => {
      setPlayState('shadowing');
      setLiveTranscript('');
      startListening(
        (interim) => setLiveTranscript(interim),
        (transcript) => {
          setLiveTranscript('');
          setShadowHeard(transcript);
          const scored = scorePronunciation(item.text, transcript);
          setShadowResult(scored);
          setPlayState('result');
          const next = saveAttempt(item.id, scored.score);
          setAttempts(next);
          trackShadowingScore(scored.score);
          if (item.level === 'B2' && scored.score >= 60) {
            trackB2Complete(item.id);
          }
        },
        () => setPlayState((s) => s === 'shadowing' ? 'idle' : s)
      );
    }, dur);
  };

  const handleDifficulty = (d: Difficulty) => {
    saveDifficulty(item.id, d);
    setDifficulty(d);
  };

  useEffect(() => () => { stop(); }, [stop]);

  const missedWords = shadowResult?.results.filter((r) => !r.matched) ?? [];

  return (
    <>
      <div className="space-y-6">
        {/* Back + meta */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                {item.level}
              </span>
              <h2 className="text-white font-bold truncate">{item.title}</h2>
            </div>
          </div>
          {/* Attempt history mini-chart */}
          {attempts.length > 0 && (
            <div className="flex items-end gap-0.5 h-6 flex-shrink-0">
              {attempts.map((s, i) => (
                <div
                  key={i}
                  className="w-2 rounded-sm"
                  style={{
                    height: `${Math.max(20, s)}%`,
                    background: s >= 80 ? '#34d399' : s >= 50 ? '#fbbf24' : '#f87171',
                    opacity: 0.6 + i * 0.15,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sentence display */}
        <div className="rounded-3xl bg-gradient-to-br from-white/8 to-white/4 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/40 uppercase tracking-wider font-semibold">
              Tap any word to hear it
            </p>
            {(playState === 'playing' || playState === 'shadowing') && (
              <WaveformBars active={true} />
            )}
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-3 items-baseline">
            {words.map((word, i) => {
              const isActive = activeWord === i;
              const clean = word.replace(/[^a-zA-Z']/g, '');
              const resultEntry = shadowResult?.results.find((r) => r.word.toLowerCase() === clean.toLowerCase());
              const hasResult = Boolean(resultEntry);
              const isMatched = resultEntry?.matched ?? true;

              return (
                <motion.button
                  key={i}
                  onClick={() => setSelectedWord(clean)}
                  animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className={`relative text-2xl md:text-3xl font-bold leading-tight transition-colors duration-150 cursor-pointer rounded-lg px-1 py-0.5`}
                  style={
                    isActive
                      ? { color: colors.gradient[0], textShadow: `0 0 20px ${colors.gradient[0]}80` }
                      : hasResult
                      ? { color: isMatched ? '#34d399' : '#f87171' }
                      : { color: 'rgba(255,255,255,0.7)' }
                  }
                >
                  {isActive && (
                    <motion.span
                      layoutId="word-highlight"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: `${colors.gradient[0]}25` }}
                    />
                  )}
                  <span className="relative z-10">{word}</span>
                </motion.button>
              );
            })}
          </div>

          <p className="text-white/30 text-sm mt-5 italic border-t border-white/5 pt-4">{item.translation}</p>
        </div>

        {/* Live transcript display */}
        <AnimatePresence>
          {playState === 'shadowing' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4"
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Live transcript</p>
              <p className="text-white/70 text-base min-h-[1.5rem]">
                {liveTranscript || <span className="text-white/20 italic">Listening…</span>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tip */}
        {item.tip && (
          <button
            onClick={() => setShowTip((v) => !v)}
            className="w-full flex items-center gap-2 text-left"
          >
            <Lightbulb className={`w-4 h-4 flex-shrink-0 ${showTip ? 'text-amber-400' : 'text-white/20'}`} />
            <AnimatePresence mode="wait">
              {showTip ? (
                <motion.p key="tip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-amber-300/80 text-sm">
                  {item.tip}
                </motion.p>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/20 text-sm">
                  Show pronunciation tip
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        )}

        {/* Controls */}
        <div className="rounded-3xl bg-white/5 border border-white/8 p-5 space-y-4">
          {/* Speed + Loop */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-white/30" />
              <div className="flex gap-1">
                {SPEED_LABELS.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => setSpeedIdx(i)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      speedIdx === i ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                    style={speedIdx === i ? { background: colors.gradient[0] + '40', color: colors.gradient[0] } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setLoop((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                loop ? 'border-violet-500/50 bg-violet-500/20 text-violet-300' : 'border-white/10 text-white/30 hover:text-white/50'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              Loop
            </button>
          </div>

          {/* Main buttons */}
          <div className="flex gap-3">
            {/* Reset */}
            <button
              onClick={handleReset}
              disabled={playState === 'idle'}
              className="p-4 rounded-2xl border-2 border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Play / Pause */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              disabled={playState === 'shadowing'}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base text-white disabled:opacity-40 transition-all"
              style={{ background: `linear-gradient(135deg, ${colors.gradient[0]}, ${colors.gradient[1]})`, boxShadow: `0 4px 20px ${colors.gradient[0]}40` }}
            >
              {playState === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {playState === 'idle' && 'Play'}
              {playState === 'playing' && 'Pause'}
              {playState === 'paused' && 'Resume'}
              {(playState === 'shadowing' || playState === 'result') && 'Play'}
            </motion.button>

            {/* Repeat last line */}
            <button
              onClick={handleRepeat}
              disabled={playState === 'playing' || playState === 'shadowing'}
              title="Repeat"
              className="p-4 rounded-2xl border-2 border-white/10 text-white/40 hover:text-white disabled:opacity-20 transition-all"
            >
              <Repeat className="w-5 h-5" />
            </button>

            {/* Shadow */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShadow}
              disabled={playState === 'playing' || playState === 'paused'}
              className={`px-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all disabled:opacity-30 flex items-center gap-2 ${
                playState === 'shadowing'
                  ? 'border-red-500/60 bg-red-500/20 text-red-300'
                  : 'border-white/15 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {playState === 'shadowing' ? (
                <>
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                    <MicOff className="w-5 h-5" />
                  </motion.span>
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Shadow
                </>
              )}
            </motion.button>
          </div>

          {/* Status text */}
          <div className="flex items-center justify-center gap-2 h-5">
            {playState === 'idle' && <p className="text-white/30 text-xs">Listen → mimic immediately → use Shadow to record</p>}
            {playState === 'playing' && (
              <>
                <WaveformBars active={true} />
                <p className="text-white/30 text-xs">Playing — focus on rhythm and intonation</p>
              </>
            )}
            {playState === 'paused' && <p className="text-white/30 text-xs">Paused</p>}
            {playState === 'shadowing' && (
              <>
                <motion.div className="w-2 h-2 rounded-full bg-red-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
                <p className="text-white/30 text-xs">Listening — shadow it now!</p>
              </>
            )}
          </div>
        </div>

        {/* Shadow Result */}
        <AnimatePresence>
          {playState === 'result' && shadowResult && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl bg-white/5 border border-white/8 p-5 space-y-4"
            >
              {/* Score + attempts chart */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-bold">Shadow Result</p>
                  {shadowHeard && (
                    <p className="text-white/30 text-xs italic mt-0.5">Heard: "{shadowHeard}"</p>
                  )}
                </div>
                <div className="flex items-end gap-3">
                  {/* Attempt history bars */}
                  {attempts.length > 1 && (
                    <div className="flex items-end gap-1 h-8">
                      {attempts.map((s, i) => (
                        <div
                          key={i}
                          className="w-2.5 rounded-sm"
                          style={{
                            height: `${Math.max(15, s)}%`,
                            background: s >= 80 ? '#34d399' : s >= 50 ? '#fbbf24' : '#f87171',
                            opacity: i === attempts.length - 1 ? 1 : 0.5,
                          }}
                          title={`Attempt ${i + 1}: ${s}%`}
                        />
                      ))}
                    </div>
                  )}
                  <span className={`text-2xl font-black ${shadowResult.score >= 80 ? 'text-emerald-400' : shadowResult.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {shadowResult.score}%
                  </span>
                  <span className="text-white/40 text-sm">{shadowResult.score >= 80 ? '🎉' : shadowResult.score >= 50 ? '👍' : '💪'}</span>
                </div>
              </div>

              {/* Word chips */}
              <div className="flex flex-wrap gap-2">
                {shadowResult.results.map((r, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`px-2.5 py-1 rounded-xl text-sm font-semibold border ${
                      r.matched
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-500/15 border-red-500/30 text-red-300'
                    }`}
                  >
                    {r.matched ? '✓' : '✗'} {r.word}
                  </motion.span>
                ))}
              </div>

              {/* Difficulty rating */}
              <div className="space-y-1.5">
                <p className="text-white/25 text-xs">How hard was this for you?</p>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => handleDifficulty(d)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-all ${
                        difficulty === d
                          ? d === 'easy' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : d === 'medium' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Coach toggle */}
              {missedWords.length > 0 && (
                <button
                  onClick={() => setAccentCoachOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/15 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-semibold">Accent Coach — {missedWords.length} word{missedWords.length !== 1 ? 's' : ''} to fix</span>
                  </div>
                  <motion.div animate={{ rotate: accentCoachOpen ? 180 : 0 }}>
                    <TrendingUp className="w-4 h-4" />
                  </motion.div>
                </button>
              )}

              {/* Accent Coach panel */}
              <AnimatePresence>
                {accentCoachOpen && missedWords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {missedWords.map((r, i) => {
                      const guide = getWordGuide(r.word);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4 space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-white font-bold text-base">{r.word}</span>
                                {guide && (
                                  <span className="text-white/40 text-sm font-mono">{guide.ipa}</span>
                                )}
                              </div>
                              {guide && (
                                <p className="text-white/50 text-xs mt-1 leading-relaxed">{guide.tip}</p>
                              )}
                            </div>
                            {/* Focus button — 0.5x speed */}
                            <button
                              onClick={() => speakFocusWord(r.word, 0.5)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs font-semibold hover:bg-violet-500/25 transition-all flex-shrink-0"
                              title="Play at 0.5× speed"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                              Focus
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShadowResult(null); setShadowHeard(''); setPlayState('idle'); setAccentCoachOpen(false); }}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-white/50 text-sm hover:text-white transition-all"
                >
                  Reset
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShadow}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-white"
                  style={{ background: `linear-gradient(135deg, ${colors.gradient[0]}, ${colors.gradient[1]})` }}
                >
                  Try again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How shadowing works */}
        <div className="rounded-2xl bg-white/3 border border-white/5 p-4 space-y-2">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">How to shadow</p>
          {[
            { step: '1', text: 'Hit "Play" — listen to the whole sentence and focus on rhythm' },
            { step: '2', text: 'Repeat IMMEDIATELY — don\'t wait for the sentence to end' },
            { step: '3', text: 'Hit "Shadow" to listen and record at the same time' },
            { step: '4', text: 'Tap any word to hear it and see examples' },
          ].map((s) => (
            <div key={s.step} className="flex gap-3 text-sm text-white/40">
              <span className="text-white/20 font-bold w-4 flex-shrink-0">{s.step}.</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Word popup */}
      <AnimatePresence>
        {selectedWord && (
          <WordPopup word={selectedWord} onClose={() => setSelectedWord(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
