'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Volume2, Mic, MicOff, ChevronRight, ChevronLeft, CheckCircle,
  RotateCcw, Home, Clock, Play, Square, BookOpen, MessageSquare,
  Layers, Zap, Users, ArrowLeft,
} from 'lucide-react';
import { speakingDays } from '@/lib/speakingCourseData';
import { useTTS, useSpeechRecognition, scorePronunciation } from '@/hooks/useSpeech';
import AppShell from '@/components/AppShell';
import PremiumGate from '@/components/PremiumGate';
import { useAuth } from '@/contexts/AuthContext';

type Phase = 'intro' | 'listen' | 'phrases' | 'shadow' | 'speak' | 'roleplay' | 'complete';

const PHASES: { id: Phase; label: string; icon: React.ElementType; minutes: number }[] = [
  { id: 'listen',  label: 'Listen',   icon: Volume2,      minutes: 10 },
  { id: 'phrases', label: 'Phrases',  icon: BookOpen,     minutes: 10 },
  { id: 'shadow',  label: 'Shadow',   icon: Layers,       minutes: 15 },
  { id: 'speak',   label: 'Speak',    icon: Mic,          minutes: 15 },
  { id: 'roleplay',label: 'Roleplay', icon: Users,        minutes: 10 },
];

export default function SpeakingDayPage() {
  const params = useParams();
  const router = useRouter();
  const day = Number(params.day);
  const dayData = speakingDays.find((d) => d.day === day);
  const { user } = useAuth();

  const [phase, setPhase] = useState<Phase>('intro');
  const [itemIndex, setItemIndex] = useState(0);
  const [playingLine, setPlayingLine] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [scoredWords, setScoredWords] = useState<{ word: string; matched: boolean }[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [phraseFlipped, setPhraseFlipped] = useState(false);
  const [seenPhrases, setSeenPhrases] = useState<Set<number>>(new Set());

  const { speak, stop } = useTTS();
  const { startListening, stopListening } = useSpeechRecognition();
  const playAllRef = useRef(false);

  useEffect(() => {
    setItemIndex(0);
    setTranscript('');
    setScore(null);
    setScoredWords([]);
    setIsRecording(false);
    setPhraseFlipped(false);
    setSeenPhrases(new Set());
    setShowTranslation(false);
    playAllRef.current = false;
    stop();
  }, [phase, stop]);

  const handleRecord = useCallback((targetText: string) => {
    if (isRecording) {
      stopListening();
      setIsRecording(false);
      return;
    }
    setTranscript('');
    setScore(null);
    setScoredWords([]);
    setIsRecording(true);
    startListening(
      (result) => {
        setTranscript(result);
        const { results, score: s } = scorePronunciation(targetText, result);
        setScore(s);
        setScoredWords(results);
        setIsRecording(false);
      },
      () => setIsRecording(false),
    );
  }, [isRecording, startListening, stopListening]);

  const playAll = useCallback(() => {
    if (!dayData) return;
    playAllRef.current = true;
    let i = 0;
    const next = () => {
      if (!playAllRef.current || i >= dayData.dialogue.lines.length) {
        setPlayingLine(null);
        return;
      }
      setPlayingLine(i);
      const utt = new SpeechSynthesisUtterance(dayData.dialogue.lines[i].text);
      utt.lang = 'en-US';
      utt.rate = 0.82;
      utt.onend = () => { i++; setTimeout(next, 600); };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    };
    next();
  }, [dayData]);

  const stopAll = useCallback(() => {
    playAllRef.current = false;
    setPlayingLine(null);
    stop();
  }, [stop]);

  const completeDay = useCallback(() => {
    try {
      const saved = localStorage.getItem('sg-sprint-progress');
      const arr: number[] = saved ? JSON.parse(saved) : [];
      if (!arr.includes(day)) {
        localStorage.setItem('sg-sprint-progress', JSON.stringify([...arr, day]));
      }
    } catch { /* ignore */ }
    setPhase('complete');
  }, [day]);

  if (!dayData) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-white/40 text-lg">Day not found</p>
            <Link href="/speaking-course" className="text-rose-400 text-sm mt-2 block">Back to course</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const phaseIndex = PHASES.findIndex((p) => p.id === phase);

  const isPremium = user?.role === 'admin' || user?.subscription?.status === 'active';
  if (!isPremium) {
    return <PremiumGate mode="fullscreen" featureName="SG Speaking Sprint" />;
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 md:px-6 pb-24">
        {/* Top bar */}
        <div className="pt-6 pb-4 flex items-center gap-3">
          <Link href="/speaking-course">
            <button className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/25">Day {day}</span>
              <span className="text-white/15">·</span>
              <span className="text-[10px] text-white/25">{dayData.context}</span>
            </div>
            <h1 className="text-base font-bold text-white mt-0.5">{dayData.title}</h1>
          </div>
          <span className="text-xl">{dayData.emoji}</span>
        </div>

        {/* Phase dots */}
        {phase !== 'intro' && phase !== 'complete' && (
          <div className="flex items-center gap-2 mb-6">
            {PHASES.map((p, i) => {
              const done = i < phaseIndex;
              const active = p.id === phase;
              return (
                <div key={p.id} className="flex items-center gap-1.5">
                  <div className={`rounded-full transition-all ${
                    active ? 'w-6 h-2 bg-rose-500' : done ? 'w-2 h-2 bg-white/30' : 'w-2 h-2 bg-white/[0.08]'
                  }`} />
                  {i < PHASES.length - 1 && <div className="h-px w-3 bg-white/[0.06]" />}
                </div>
              );
            })}
            <span className="ml-auto text-[10px] text-white/20 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {PHASES[phaseIndex]?.minutes} min
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* INTRO */}
          {phase === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="text-center mb-8">
                <div
                  className="w-24 h-24 rounded-3xl mx-auto mb-4 flex items-center justify-center text-5xl"
                  style={{ background: `linear-gradient(135deg, ${dayData.gradient[0]}30, ${dayData.gradient[1]}20)`, border: `1px solid ${dayData.gradient[0]}40` }}
                >
                  {dayData.emoji}
                </div>
                <h2 className="text-2xl font-black text-white">{dayData.title}</h2>
                <p className="text-white/40 text-sm mt-1">{dayData.subtitle}</p>
                <p className="text-white/25 text-xs mt-2 px-4">{dayData.dialogue.context}</p>
              </div>

              <div className="space-y-2 mb-8">
                {PHASES.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white/30" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white/70">{p.label}</p>
                      </div>
                      <span className="text-xs text-white/20">{p.minutes} min</span>
                      <span className="text-[10px] font-bold text-white/15 bg-white/[0.04] px-2 py-0.5 rounded-full">{i + 1}/5</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setPhase('listen')}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
                style={{ background: `linear-gradient(135deg, ${dayData.gradient[0]}, ${dayData.gradient[1]})` }}
              >
                Begin Today's Session
              </button>
            </motion.div>
          )}

          {/* LISTEN */}
          {phase === 'listen' && (
            <motion.div key="listen" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white">Listen to the Dialogue</h2>
                <p className="text-white/35 text-sm mt-0.5">{dayData.dialogue.context}</p>
              </div>

              <div className="flex gap-2 mb-5">
                {playingLine !== null ? (
                  <button onClick={stopAll} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 text-sm font-semibold">
                    <Square className="w-3.5 h-3.5" /> Stop
                  </button>
                ) : (
                  <button onClick={playAll} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white/70 text-sm font-semibold hover:bg-white/[0.09] transition-colors">
                    <Play className="w-3.5 h-3.5" /> Play All
                  </button>
                )}
                <button onClick={() => setShowTranslation(!showTranslation)} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/40 text-xs font-semibold hover:bg-white/[0.07] transition-colors">
                  {showTranslation ? 'Hide' : 'Show'} Translation
                </button>
              </div>

              <div className="space-y-2 mb-8">
                {dayData.dialogue.lines.map((line, i) => {
                  const isYou = line.speaker === 'You';
                  const isPlaying = playingLine === i;
                  return (
                    <motion.div
                      key={i}
                      animate={{ opacity: playingLine !== null && !isPlaying ? 0.4 : 1 }}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isPlaying
                          ? 'border-rose-500/40 bg-rose-500/[0.08]'
                          : isYou
                          ? 'border-white/[0.08] bg-white/[0.04]'
                          : 'border-white/[0.06] bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isYou ? 'text-rose-400' : 'text-cyan-400'}`}>
                              {line.speaker}
                            </span>
                            <span className="text-[10px] text-white/20">{line.role}</span>
                          </div>
                          <p className="text-sm text-white leading-relaxed">{line.text}</p>
                          {showTranslation && (
                            <p className="text-xs text-white/35 mt-1 italic">{line.translation}</p>
                          )}
                        </div>
                        <button
                          onClick={() => { stop(); speak(line.text, 0.82); }}
                          className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/25 hover:text-white/60 transition-colors flex-shrink-0"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button
                onClick={() => setPhase('phrases')}
                className="w-full py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.09] transition-colors"
              >
                Continue to Key Phrases <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* PHRASES */}
          {phase === 'phrases' && (
            <motion.div key="phrases" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Key Phrases</h2>
                <p className="text-white/35 text-sm">Learn these expressions before speaking practice</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/25">{itemIndex + 1} / {dayData.keyPhrases.length}</span>
                <div className="flex gap-1">
                  {dayData.keyPhrases.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${seenPhrases.has(i) ? 'bg-emerald-400' : i === itemIndex ? 'bg-white/60' : 'bg-white/[0.12]'}`} />
                  ))}
                </div>
              </div>

              {(() => {
                const phrase = dayData.keyPhrases[itemIndex];
                return (
                  <div className="space-y-3 mb-8">
                    <div
                      className="p-6 rounded-2xl border text-center"
                      style={{ background: `linear-gradient(135deg, ${dayData.gradient[0]}15, ${dayData.gradient[1]}10)`, borderColor: `${dayData.gradient[0]}40` }}
                    >
                      <p className="text-2xl font-black text-white mb-1">{phrase.phrase}</p>
                      <div className="flex justify-center gap-2 mt-3">
                        <button
                          onClick={() => speak(phrase.phrase, 0.75)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] text-white/50 text-xs font-semibold hover:bg-white/[0.12] transition-colors"
                        >
                          <Volume2 className="w-3 h-3" /> Hear Phrase
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                      <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Meaning</p>
                      <p className="text-white/70 text-sm">{phrase.meaning}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                      <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Example</p>
                      <p className="text-white text-sm mb-1">{phrase.example}</p>
                      <p className="text-white/35 text-xs italic">{phrase.exampleTranslation}</p>
                      <button
                        onClick={() => speak(phrase.example, 0.8)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                      >
                        <Volume2 className="w-3 h-3" /> Hear example
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2">
                {itemIndex > 0 && (
                  <button
                    onClick={() => setItemIndex(itemIndex - 1)}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 font-semibold text-sm hover:bg-white/[0.07] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSeenPhrases((prev) => new Set([...prev, itemIndex]));
                    if (itemIndex < dayData.keyPhrases.length - 1) {
                      setItemIndex(itemIndex + 1);
                      setPhraseFlipped(false);
                    } else {
                      setPhase('shadow');
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.09] transition-colors"
                >
                  {itemIndex < dayData.keyPhrases.length - 1 ? (
                    <><ChevronRight className="w-4 h-4" /> Next Phrase</>
                  ) : (
                    <>Continue to Shadowing <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* SHADOW */}
          {phase === 'shadow' && (
            <motion.div key="shadow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Shadowing Practice</h2>
                <p className="text-white/35 text-sm">Listen → repeat out loud → check your score</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/25">Sentence {itemIndex + 1} / {dayData.shadowSentences.length}</span>
                <div className="flex gap-1">
                  {dayData.shadowSentences.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i < itemIndex ? 'w-6 bg-emerald-400' : i === itemIndex ? 'w-6 bg-rose-400' : 'w-3 bg-white/[0.10]'}`} />
                  ))}
                </div>
              </div>

              {(() => {
                const sentence = dayData.shadowSentences[itemIndex];
                return (
                  <div className="space-y-3 mb-6">
                    <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                      <p className="text-xl font-bold text-white leading-relaxed mb-2">{sentence.text}</p>
                      <p className="text-white/35 text-sm">{sentence.translation}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
                      <p className="text-[10px] uppercase tracking-wider text-amber-400/70 mb-1">Pronunciation Tip</p>
                      <p className="text-amber-200/70 text-sm">{sentence.tip}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => speak(sentence.text, 0.75)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white/60 text-sm font-semibold hover:bg-white/[0.08] transition-colors"
                      >
                        <Volume2 className="w-4 h-4" /> Listen Slowly
                      </button>
                      <button
                        onClick={() => handleRecord(sentence.text)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          isRecording
                            ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                        }`}
                      >
                        {isRecording ? <><MicOff className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Shadow It</>}
                      </button>
                    </div>

                    {/* Score display */}
                    {score !== null && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold text-white">
                            {score >= 80 ? '🎯 Great match!' : score >= 60 ? '👍 Good try!' : '🔄 Keep practicing'}
                          </p>
                          <span className={`text-lg font-black ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {score}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {scoredWords.map((w, i) => (
                            <span key={i} className={`text-sm font-medium px-1.5 py-0.5 rounded ${w.matched ? 'text-emerald-300 bg-emerald-500/10' : 'text-red-300 bg-red-500/10'}`}>
                              {w.word}
                            </span>
                          ))}
                        </div>
                        {transcript && (
                          <p className="text-white/25 text-xs mt-2 italic">You said: "{transcript}"</p>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })()}

              <div className="flex gap-2">
                {score !== null && (
                  <button
                    onClick={() => { setTranscript(''); setScore(null); setScoredWords([]); }}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 text-sm font-semibold hover:bg-white/[0.07] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setTranscript(''); setScore(null); setScoredWords([]);
                    if (itemIndex < dayData.shadowSentences.length - 1) {
                      setItemIndex(itemIndex + 1);
                    } else {
                      setPhase('speak');
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.09] transition-colors"
                >
                  {itemIndex < dayData.shadowSentences.length - 1 ? (
                    <><ChevronRight className="w-4 h-4" /> Next Sentence</>
                  ) : (
                    <>Continue to Speaking <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* SPEAK */}
          {phase === 'speak' && (
            <motion.div key="speak" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Speaking Practice</h2>
                <p className="text-white/35 text-sm">Respond naturally to each situation</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/25">Prompt {itemIndex + 1} / {dayData.speakingPrompts.length}</span>
                <div className="flex gap-1">
                  {dayData.speakingPrompts.map((_, i) => (
                    <div key={i} className={`w-5 h-1.5 rounded-full transition-colors ${i < itemIndex ? 'bg-emerald-400' : i === itemIndex ? 'bg-rose-400' : 'bg-white/[0.10]'}`} />
                  ))}
                </div>
              </div>

              {(() => {
                const prompt = dayData.speakingPrompts[itemIndex];
                return (
                  <div className="space-y-3 mb-6">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                      <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Situation</p>
                      <p className="text-white/60 text-sm">{prompt.situation}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.09]">
                      <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-1.5">They say:</p>
                      <p className="text-white font-semibold text-base">"{prompt.theyAsk}"</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-dashed border-white/[0.08]">
                      <p className="text-[10px] uppercase tracking-wider text-white/20 mb-1">Suggested response</p>
                      <p className="text-white/40 text-sm italic">"{prompt.yourTarget}"</p>
                      <p className="text-white/20 text-xs mt-1">{prompt.translation}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => speak(prompt.yourTarget, 0.8)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white/60 text-sm font-semibold hover:bg-white/[0.08] transition-colors"
                      >
                        <Volume2 className="w-4 h-4" /> Hear Model
                      </button>
                      <button
                        onClick={() => handleRecord(prompt.yourTarget)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          isRecording
                            ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                        }`}
                      >
                        {isRecording ? <><MicOff className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Record</>}
                      </button>
                    </div>

                    {score !== null && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-white">
                            {score >= 80 ? '🎯 Excellent!' : score >= 55 ? '👍 Good response!' : '🔄 Try again'}
                          </p>
                          <span className={`text-lg font-black ${score >= 80 ? 'text-emerald-400' : score >= 55 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {score}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {scoredWords.map((w, i) => (
                            <span key={i} className={`text-xs px-1 py-0.5 rounded ${w.matched ? 'text-emerald-300' : 'text-red-300/60'}`}>{w.word}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}

              <div className="flex gap-2">
                {score !== null && (
                  <button
                    onClick={() => { setTranscript(''); setScore(null); setScoredWords([]); }}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 text-sm hover:bg-white/[0.07] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setTranscript(''); setScore(null); setScoredWords([]);
                    if (itemIndex < dayData.speakingPrompts.length - 1) {
                      setItemIndex(itemIndex + 1);
                    } else {
                      setPhase('roleplay');
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.09] transition-colors"
                >
                  {itemIndex < dayData.speakingPrompts.length - 1 ? (
                    <><ChevronRight className="w-4 h-4" /> Next Prompt</>
                  ) : (
                    <>Continue to Roleplay <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* ROLEPLAY */}
          {phase === 'roleplay' && (
            <motion.div key="roleplay" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Role Play</h2>
                <p className="text-white/35 text-sm">{dayData.roleplay.scenario}</p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-5">
                <div className="flex-1">
                  <p className="text-xs text-rose-400 font-semibold">You: {dayData.roleplay.yourRole}</p>
                  <p className="text-xs text-cyan-400 font-semibold mt-0.5">Them: {dayData.roleplay.theirRole}</p>
                </div>
                <div className="text-xs text-white/20">{itemIndex + 1} / {dayData.roleplay.lines.length}</div>
              </div>

              <div className="flex gap-1 mb-5">
                {dayData.roleplay.lines.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i < itemIndex ? 'bg-emerald-400' : i === itemIndex ? 'bg-rose-400' : 'bg-white/[0.08]'}`} />
                ))}
              </div>

              {(() => {
                const line = dayData.roleplay.lines[itemIndex];
                const isYou = line.speaker === 'you';
                return (
                  <div className="space-y-3 mb-6">
                    <div className={`p-5 rounded-2xl border ${isYou ? 'bg-rose-500/[0.07] border-rose-500/25' : 'bg-cyan-500/[0.07] border-cyan-500/25'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isYou ? 'text-rose-400' : 'text-cyan-400'}`}>
                          {line.speakerName} {isYou ? '(You)' : ''}
                        </span>
                      </div>
                      {isYou ? (
                        <>
                          {line.hint && (
                            <p className="text-white/35 text-sm italic mb-3">💡 {line.hint}</p>
                          )}
                          <p className="text-white/20 text-sm">[Target: {line.text}]</p>
                          <p className="text-white/20 text-xs mt-1">{line.translation}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-white font-medium text-base">{line.text}</p>
                          <p className="text-white/35 text-sm mt-1">{line.translation}</p>
                        </>
                      )}
                    </div>

                    {isYou ? (
                      <>
                        <div className="flex gap-2">
                          <button
                            onClick={() => speak(line.text, 0.8)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white/60 text-sm font-semibold hover:bg-white/[0.08] transition-colors"
                          >
                            <Volume2 className="w-4 h-4" /> Hear Line
                          </button>
                          <button
                            onClick={() => handleRecord(line.text)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                              isRecording
                                ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                                : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                            }`}
                          >
                            {isRecording ? <><MicOff className="w-4 h-4" /> Stop</> : <><Mic className="w-4 h-4" /> Speak</>}
                          </button>
                        </div>
                        {score !== null && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white">{score >= 75 ? '🎯 Nice!' : '👍 Got it!'}</span>
                              <span className={`font-black text-base ${score >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>{score}%</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {scoredWords.map((w, i) => (
                                <span key={i} className={`text-xs px-1 rounded ${w.matched ? 'text-emerald-300' : 'text-red-300/60'}`}>{w.word}</span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => speak(line.text, 0.82)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/15 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" /> Play Their Line
                      </button>
                    )}
                  </div>
                );
              })()}

              <button
                onClick={() => {
                  setTranscript(''); setScore(null); setScoredWords([]);
                  if (itemIndex < dayData.roleplay.lines.length - 1) {
                    setItemIndex(itemIndex + 1);
                  } else {
                    completeDay();
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.10] text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.09] transition-colors"
              >
                {itemIndex < dayData.roleplay.lines.length - 1 ? (
                  <><ChevronRight className="w-4 h-4" /> Next Line</>
                ) : (
                  <><Zap className="w-4 h-4" /> Complete Day {day}</>
                )}
              </button>
            </motion.div>
          )}

          {/* COMPLETE */}
          {phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-28 h-28 rounded-3xl mx-auto mb-6 flex items-center justify-center text-6xl"
                  style={{ background: `linear-gradient(135deg, ${dayData.gradient[0]}30, ${dayData.gradient[1]}20)`, border: `2px solid ${dayData.gradient[0]}50` }}
                >
                  {dayData.emoji}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-3xl font-black text-white mb-1">Day {day} Done!</h2>
                  <p className="text-white/40 text-base mb-1">{dayData.title}</p>
                  <p className="text-white/25 text-sm">60 minutes · 5 phases completed</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-left">
                  <p className="text-xs uppercase tracking-wider text-white/25 mb-3">Today you practiced</p>
                  <div className="space-y-2">
                    {[
                      `${dayData.dialogue.lines.length} dialogue lines`,
                      `${dayData.keyPhrases.length} key phrases`,
                      `${dayData.shadowSentences.length} shadowing sentences`,
                      `${dayData.speakingPrompts.length} speaking prompts`,
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-white/60 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {dayData.dailyTip && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-4 p-4 rounded-2xl bg-amber-500/[0.07] border border-amber-500/20 text-left">
                    <p className="text-xs font-bold text-amber-400 mb-1">{dayData.dailyTip.title}</p>
                    <p className="text-amber-200/60 text-sm">{dayData.dailyTip.content}</p>
                    {dayData.dailyTip.singlishNote && (
                      <p className="text-amber-200/40 text-xs mt-2 italic">Singlish: {dayData.dailyTip.singlishNote}</p>
                    )}
                  </motion.div>
                )}

                {day < 15 && (() => {
                  const nextDay = speakingDays.find((d) => d.day === day + 1);
                  if (!nextDay) return null;
                  return (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-4">
                      <Link href={`/speaking-course/${day + 1}`}>
                        <div className="p-4 rounded-2xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.07] transition-all cursor-pointer flex items-center gap-3">
                          <span className="text-2xl">{nextDay.emoji}</span>
                          <div className="flex-1 text-left">
                            <p className="text-[10px] text-white/25 font-bold uppercase tracking-wider">Next · Day {day + 1}</p>
                            <p className="text-white font-bold text-sm">{nextDay.title}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/25" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })()}

                {day === 15 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 text-center">
                    <p className="text-2xl mb-2">🎉</p>
                    <p className="text-white font-bold">Course Complete!</p>
                    <p className="text-white/40 text-sm mt-1">You're ready for Singapore. Good luck!</p>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="mt-6 flex gap-2">
                  <Link href="/speaking-course" className="flex-1">
                    <button className="w-full py-3 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white/50 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.08] transition-colors">
                      <Home className="w-4 h-4" /> Back to Course
                    </button>
                  </Link>
                  {day < 15 && (
                    <Link href={`/speaking-course/${day + 1}`} className="flex-1">
                      <button className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${dayData.gradient[0]}, ${dayData.gradient[1]})` }}>
                        Day {day + 1} <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase back nav (not on intro/complete) */}
        {phase !== 'intro' && phase !== 'complete' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
            <button
              onClick={() => {
                stop(); stopListening(); setIsRecording(false);
                const prev = PHASES[phaseIndex - 1];
                setPhase(prev ? prev.id : 'intro');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#08080e]/90 border border-white/[0.08] text-white/30 text-xs font-semibold hover:text-white/60 transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
