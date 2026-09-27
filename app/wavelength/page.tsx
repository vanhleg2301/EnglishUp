'use client';

import { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Play, Plus, Trash2, Shuffle, Eye, EyeOff, Lock, ChevronRight,
  Minus, Settings2, RotateCcw, Trophy, Timer, Users, Layers,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import {
  BUILT_IN_CARDS, WAVELENGTH_CATEGORIES, DIFFICULTY, shuffle, parseCardLines, scoreGuess,
  type SpectrumCard, type WavelengthCategory, type Difficulty,
} from '@/lib/wavelengthData';

const SETTINGS_KEY = 'eng-wavelength-settings';
const CUSTOM_KEY = 'eng-wavelength-custom-cards';

interface Settings {
  teams: string[];
  targetScore: number;
  timer: number; // seconds, 0 = off
  difficulty: Difficulty;
  categories: WavelengthCategory[];
  includeCustom: boolean;
  /** Categories that existed when settings were last saved — newer ones get switched on. */
  seenCats: WavelengthCategory[];
}

const DEFAULT_SETTINGS: Settings = {
  teams: ['Team Blue', 'Team Pink'],
  targetScore: 10,
  timer: 0,
  difficulty: 'normal',
  categories: WAVELENGTH_CATEGORIES.map((c) => c.id),
  includeCustom: true,
  seenCats: WAVELENGTH_CATEGORIES.map((c) => c.id),
};

const LEGACY_CATS: WavelengthCategory[] = ['everyday', 'food', 'people', 'work', 'abstract', 'culture'];

const TEAM_COLORS = [
  { text: 'text-sky-300', bg: 'bg-sky-500/15', border: 'border-sky-400/40', dot: 'bg-sky-400' },
  { text: 'text-pink-300', bg: 'bg-pink-500/15', border: 'border-pink-400/40', dot: 'bg-pink-400' },
  { text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-400/40', dot: 'bg-emerald-400' },
  { text: 'text-amber-300', bg: 'bg-amber-500/15', border: 'border-amber-400/40', dot: 'bg-amber-400' },
];

type Phase = 'setup' | 'handoff' | 'psychic' | 'guess' | 'reveal' | 'gameover';

function randomTarget() {
  return Math.round((2 + Math.random() * 96) * 10) / 10;
}

// ─── Dial ────────────────────────────────────────────────────────────────────

const CX = 100;
const CY = 100;
const R = 92;

function polar(value: number, radius: number) {
  const a = Math.PI * (1 - value / 100);
  return { x: CX + radius * Math.cos(a), y: CY - radius * Math.sin(a) };
}

function wedge(from: number, to: number) {
  const lo = Math.max(0, from);
  const hi = Math.min(100, to);
  const p1 = polar(lo, R);
  const p2 = polar(hi, R);
  return `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y} Z`;
}

const HALF_DISC = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY} Z`;

interface DialProps {
  target: number;
  guess: number;
  showTarget: boolean;
  showNeedle: boolean;
  interactive: boolean;
  difficulty: Difficulty;
  onGuess?: (v: number) => void;
}

function Dial({ target, guess, showTarget, showNeedle, interactive, difficulty, onGuess }: DialProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const [b4, b3, b2] = DIFFICULTY[difficulty].bands;

  const valueFromEvent = (e: React.PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const scale = rect.width / 200;
    const x = (e.clientX - rect.left) / scale - CX;
    const y = CY - (e.clientY - rect.top) / scale;
    let a = Math.atan2(Math.max(y, 0), x);
    if (y <= 0) a = x < 0 ? Math.PI : 0;
    return Math.round((1 - a / Math.PI) * 1000) / 10;
  };

  const zones = [
    { lo: target - b2, hi: target + b2, fill: '#f59e0b', pts: 2 },
    { lo: target - b3, hi: target + b3, fill: '#f97316', pts: 3 },
    { lo: target - b4, hi: target + b4, fill: '#e11d48', pts: 4 },
  ];
  const labels = [
    { v: target - (b3 + b2) / 2, pts: 2 },
    { v: target - (b4 + b3) / 2, pts: 3 },
    { v: target, pts: 4 },
    { v: target + (b4 + b3) / 2, pts: 3 },
    { v: target + (b3 + b2) / 2, pts: 2 },
  ].filter((l) => l.v > 1 && l.v < 99);

  const ticks = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 108"
      className={`w-full select-none outline-none ${interactive ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ touchAction: interactive ? 'none' : 'auto' }}
      role={interactive ? 'slider' : 'img'}
      aria-label="Wavelength dial"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(guess)}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(e) => {
        if (!interactive || !onGuess) return;
        if (e.key === 'ArrowLeft') onGuess(Math.max(0, guess - (e.shiftKey ? 5 : 1)));
        if (e.key === 'ArrowRight') onGuess(Math.min(100, guess + (e.shiftKey ? 5 : 1)));
      }}
      onPointerDown={(e) => {
        if (!interactive || !onGuess) return;
        svgRef.current?.setPointerCapture(e.pointerId);
        setDragging(true);
        onGuess(valueFromEvent(e));
      }}
      onPointerMove={(e) => {
        if (dragging && onGuess) onGuess(valueFromEvent(e));
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <defs>
        <clipPath id="wl-clip">
          <path d={HALF_DISC} />
        </clipPath>
        <linearGradient id="wl-face" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#f5f3ea" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="wl-shutter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
      </defs>

      <g clipPath="url(#wl-clip)">
        <path d={HALF_DISC} fill="#f5f0e1" />
        {zones.map((z) => (
          <path key={z.pts} d={wedge(z.lo, z.hi)} fill={z.fill} />
        ))}
        {labels.map((l, i) => {
          const p = polar(l.v, R - 10);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fontWeight="800"
              fill="white"
            >
              {l.pts}
            </text>
          );
        })}

        {/* Shutter — swings down out of view to reveal the target */}
        <g
          style={{
            transform: `rotate(${showTarget ? 180 : 0}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transition: 'transform 0.9s cubic-bezier(0.65, 0, 0.35, 1)',
          }}
        >
          <path d={HALF_DISC} fill="url(#wl-shutter)" />
          {ticks.map((t) => {
            const a = polar(t, R - 3);
            const b = polar(t, t % 25 === 0 ? R - 11 : R - 7);
            return (
              <line key={t} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="white" strokeOpacity={0.25} strokeWidth={0.8} />
            );
          })}
          <text x={CX} y={CY - 38} textAnchor="middle" fontSize="7" fill="white" fillOpacity={0.35} letterSpacing="2">
            WAVELENGTH
          </text>
        </g>
      </g>

      {/* Rim */}
      <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="white" strokeOpacity={0.15} strokeWidth={1.5} />
      <line x1={CX - R - 4} y1={CY} x2={CX + R + 4} y2={CY} stroke="white" strokeOpacity={0.15} strokeWidth={1.5} />

      {/* Needle */}
      <g
        style={{
          transform: `rotate(${(guess - 50) * 1.8}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
          transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s',
          opacity: showNeedle ? 1 : 0,
        }}
      >
        <line x1={CX} y1={CY} x2={CX} y2={CY - R + 4} stroke="#ef4444" strokeWidth={3} strokeLinecap="round" />
        <circle cx={CX} cy={CY - R + 6} r={2.5} fill="#ef4444" />
      </g>
      <circle cx={CX} cy={CY} r={8} fill="#b91c1c" stroke="#fecaca" strokeOpacity={0.5} strokeWidth={1} />
    </svg>
  );
}

// ─── Small UI helpers ────────────────────────────────────────────────────────

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all ${
        active
          ? 'bg-white text-black border-white'
          : 'bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/15'
      }`}
    >
      {children}
    </motion.button>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-3">
      <div className="flex items-center gap-2 text-white/70">
        <Icon className="w-4 h-4" />
        <p className="text-sm font-bold">{title}</p>
      </div>
      {children}
    </div>
  );
}

function CardFace({ card }: { card: SpectrumCard }) {
  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="grid grid-cols-2 rounded-2xl overflow-hidden border border-white/10 text-center"
    >
      <div className="px-3 py-4 bg-gradient-to-br from-cyan-500/25 to-cyan-500/5">
        <p className="text-[10px] uppercase tracking-widest text-cyan-200/50 mb-1">← Left</p>
        <p className="font-black text-base sm:text-xl leading-tight text-cyan-50">{card.left}</p>
      </div>
      <div className="px-3 py-4 bg-gradient-to-bl from-orange-500/25 to-orange-500/5">
        <p className="text-[10px] uppercase tracking-widest text-orange-200/50 mb-1">Right →</p>
        <p className="font-black text-base sm:text-xl leading-tight text-orange-50">{card.right}</p>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const noopSubscribe = () => () => {};

// Settings live in localStorage, so only render the game after hydration.
export default function WavelengthPage() {
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return isClient ? <WavelengthGame /> : <AppShell><div /></AppShell>;
}

function WavelengthGame() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = readStored<Partial<Settings>>(SETTINGS_KEY, {});
    const seen = saved.seenCats ?? LEGACY_CATS;
    const merged = { ...DEFAULT_SETTINGS, ...saved };
    const added = DEFAULT_SETTINGS.categories.filter((c) => !seen.includes(c) && !merged.categories.includes(c));
    return { ...merged, categories: [...merged.categories, ...added], seenCats: DEFAULT_SETTINGS.seenCats };
  });
  const [customCards, setCustomCards] = useState<SpectrumCard[]>(() => readStored(CUSTOM_KEY, []));
  const [bulkText, setBulkText] = useState('');

  const [phase, setPhase] = useState<Phase>('setup');
  const [scores, setScores] = useState<number[]>([]);
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState<SpectrumCard[]>([]);
  const [card, setCard] = useState<SpectrumCard | null>(null);
  const [target, setTarget] = useState(50);
  const [guess, setGuess] = useState(50);
  const [clue, setClue] = useState('');
  const [lastPoints, setLastPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(customCards));
    } catch {
      // storage full / unavailable
    }
  }, [settings, customCards]);

  const pool = useMemo(
    () => [
      ...BUILT_IN_CARDS.filter((c) => settings.categories.includes(c.category as WavelengthCategory)),
      ...(settings.includeCustom ? customCards : []),
    ],
    [settings.categories, settings.includeCustom, customCards],
  );

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  // Draw the next card; reshuffle the pool once it runs out so cards don't repeat early.
  const drawCard = () => {
    let next = deck.length ? deck : shuffle(pool);
    if (card && next.length > 1 && next[0].id === card.id) next = [...next.slice(1), next[0]];
    setCard(next[0] ?? null);
    setDeck(next.slice(1));
  };

  const startTurn = () => {
    drawCard();
    setTarget(randomTarget());
    setGuess(50);
    setClue('');
    setPhase('handoff');
  };

  const startGame = () => {
    setScores(settings.teams.map(() => 0));
    setTurn(0);
    setRound(1);
    const fresh = shuffle(pool);
    setCard(fresh[0] ?? null);
    setDeck(fresh.slice(1));
    setTarget(randomTarget());
    setGuess(50);
    setClue('');
    setPhase('handoff');
  };

  const lockGuess = useCallback(() => {
    const pts = scoreGuess(target, guess, settings.difficulty);
    setLastPoints(pts);
    setScores((s) => s.map((v, i) => (i === turn ? v + pts : v)));
    setPhase('reveal');
  }, [target, guess, settings.difficulty, turn]);

  const nextTurn = () => {
    const winner = scores.findIndex((s) => s >= settings.targetScore);
    if (winner !== -1) {
      setPhase('gameover');
      return;
    }
    const nextTeam = (turn + 1) % settings.teams.length;
    if (nextTeam === 0) setRound((r) => r + 1);
    setTurn(nextTeam);
    startTurn();
  };

  // Guess timer — auto-locks the current needle position when time runs out
  const lockRef = useRef(lockGuess);
  useEffect(() => {
    lockRef.current = lockGuess;
  }, [lockGuess]);

  useEffect(() => {
    if (phase !== 'guess' || !settings.timer) return;
    const endsAt = Date.now() + settings.timer * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) {
        clearInterval(id);
        lockRef.current();
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase, settings.timer]);

  const addCustom = () => {
    const parsed = parseCardLines(bulkText);
    if (!parsed.length) return;
    const stamp = Date.now();
    setCustomCards((cs) => [
      ...cs,
      ...parsed.map((p, i) => ({ id: `custom-${stamp}-${i}`, left: p.left, right: p.right, category: 'custom' as const })),
    ]);
    setBulkText('');
  };

  const teamColor = (i: number) => TEAM_COLORS[i % TEAM_COLORS.length];
  const currentTeam = settings.teams[turn] ?? '';
  const leader = scores.length ? scores.indexOf(Math.max(...scores)) : 0;
  const inGame = phase !== 'setup';

  return (
    <AppShell>
      <div className="text-white overflow-x-hidden">
        <header className="sticky top-0 z-10 bg-[#07070f]/90 backdrop-blur-md border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            {inGame ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (phase === 'gameover' || confirm('Quit this game and go back to settings?')) setPhase('setup');
                }}
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Back to settings"
              >
                <Settings2 className="w-5 h-5" />
              </motion.button>
            ) : (
              <Link href="/app">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base leading-none">Wavelength</p>
              <p className="text-white/30 text-xs mt-0.5">
                {inGame ? `Round ${round} · first to ${settings.targetScore}` : 'Read minds, speak English'}
              </p>
            </div>
          </div>

          {inGame && (
            <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
              {settings.teams.map((name, i) => {
                const c = teamColor(i);
                const active = i === turn && phase !== 'gameover';
                return (
                  <motion.div
                    key={i}
                    layout
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm whitespace-nowrap transition-all ${
                      active ? `${c.bg} ${c.border}` : 'bg-white/[0.03] border-white/[0.06] opacity-60'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className={`font-semibold ${c.text}`}>{name}</span>
                    <motion.span key={scores[i]} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="font-black tabular-nums">
                      {scores[i] ?? 0}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </header>

        <main className="max-w-3xl mx-auto px-4 pb-16 pt-6">
          <AnimatePresence mode="wait">
            {/* ─── Setup ─── */}
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4"
              >
                <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-orange-500/10 border border-white/10">
                  <p className="font-black text-2xl">How to play</p>
                  <ol className="text-white/60 text-sm mt-2 space-y-1 list-decimal list-inside">
                    <li>The <b className="text-white/80">Psychic</b> secretly sees where the target is on the dial.</li>
                    <li>They give <b className="text-white/80">one English clue</b> that sits at that point between the two words.</li>
                    <li>The team turns the needle. Bullseye = 4 pts, close = 3 or 2.</li>
                  </ol>
                </div>

                <Section icon={Users} title={`Teams (${settings.teams.length})`}>
                  <div className="space-y-2">
                    {settings.teams.map((name, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${teamColor(i).dot}`} />
                        <input
                          value={name}
                          maxLength={24}
                          onChange={(e) => update('teams', settings.teams.map((t, j) => (j === i ? e.target.value : t)))}
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm focus:outline-none focus:border-white/25"
                        />
                        {settings.teams.length > 1 && (
                          <button
                            onClick={() => update('teams', settings.teams.filter((_, j) => j !== i))}
                            className="p-2 rounded-lg text-white/30 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                            aria-label="Remove team"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {settings.teams.length < 4 && (
                    <button
                      onClick={() => update('teams', [...settings.teams, `Team ${settings.teams.length + 1}`])}
                      className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add team
                    </button>
                  )}
                </Section>

                <Section icon={Trophy} title="Game rules">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40 mb-1.5">Points to win</p>
                      <div className="flex flex-wrap gap-2">
                        {[5, 10, 15, 20].map((n) => (
                          <Chip key={n} active={settings.targetScore === n} onClick={() => update('targetScore', n)}>{n}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1.5">Guess timer</p>
                      <div className="flex flex-wrap gap-2">
                        {[0, 30, 60, 90].map((n) => (
                          <Chip key={n} active={settings.timer === n} onClick={() => update('timer', n)}>{n ? `${n}s` : 'Off'}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1.5">Target size</p>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(DIFFICULTY) as Difficulty[]).map((d) => (
                          <Chip key={d} active={settings.difficulty === d} onClick={() => update('difficulty', d)}>
                            {DIFFICULTY[d].label}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </Section>

                <Section icon={Layers} title={`Card deck (${pool.length} cards)`}>
                  <div className="flex flex-wrap gap-2">
                    {WAVELENGTH_CATEGORIES.map((c) => {
                      const on = settings.categories.includes(c.id);
                      return (
                        <Chip
                          key={c.id}
                          active={on}
                          onClick={() =>
                            update('categories', on ? settings.categories.filter((x) => x !== c.id) : [...settings.categories, c.id])
                          }
                        >
                          {c.emoji} {c.label}
                        </Chip>
                      );
                    })}
                    <Chip active={settings.includeCustom} onClick={() => update('includeCustom', !settings.includeCustom)}>
                      ✏️ My cards ({customCards.length})
                    </Chip>
                  </div>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs text-white/40">Add your own cards — one per line, e.g. <span className="text-white/60 font-mono">Cold | Hot</span></p>
                    <textarea
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      rows={3}
                      placeholder={'Bad singer | Great singer\nCheap date | Fancy date'}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm font-mono focus:outline-none focus:border-white/25 resize-y"
                    />
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={addCustom}
                        disabled={!parseCardLines(bulkText).length}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-sm font-semibold hover:bg-white/15 disabled:opacity-40 transition-all"
                      >
                        <Plus className="w-4 h-4" /> Add {parseCardLines(bulkText).length || ''} card{parseCardLines(bulkText).length === 1 ? '' : 's'}
                      </motion.button>
                      {customCards.length > 0 && (
                        <button
                          onClick={() => confirm('Delete all your custom cards?') && setCustomCards([])}
                          className="text-xs text-white/30 hover:text-rose-300 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  {customCards.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <AnimatePresence>
                        {customCards.map((c) => (
                          <motion.span
                            key={c.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-white/70"
                          >
                            {c.left} <span className="text-white/25">↔</span> {c.right}
                            <button
                              onClick={() => setCustomCards((cs) => cs.filter((x) => x.id !== c.id))}
                              className="p-1 rounded text-white/30 hover:text-rose-300"
                              aria-label="Delete card"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </Section>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={startGame}
                  disabled={!pool.length || settings.teams.some((t) => !t.trim())}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-black text-lg shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:shadow-none"
                >
                  <Play className="w-5 h-5 fill-current" /> Start game
                </motion.button>
                {!pool.length && <p className="text-center text-xs text-rose-300/80">Pick at least one category or add your own cards.</p>}
              </motion.div>
            )}

            {/* ─── Hand-off: pass device to the Psychic ─── */}
            {phase === 'handoff' && (
              <motion.div
                key={`handoff-${round}-${turn}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-5"
              >
                <p className={`text-sm font-bold uppercase tracking-widest ${teamColor(turn).text}`}>{currentTeam}&apos;s turn</p>
                <p className="text-3xl sm:text-4xl font-black max-w-md leading-tight">Choose a Psychic.<br />Everyone else — look away! 🙈</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPhase('psychic')}
                  className="mt-2 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black font-bold"
                >
                  <Eye className="w-5 h-5" /> I&apos;m the Psychic — show me
                </motion.button>
              </motion.div>
            )}

            {/* ─── Psychic / Guess / Reveal share the dial ─── */}
            {(phase === 'psychic' || phase === 'guess' || phase === 'reveal') && card && (
              <motion.div
                key="board"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <p className={`font-bold ${teamColor(turn).text}`}>
                    {phase === 'psychic' ? '🔮 Psychic only' : phase === 'guess' ? `🎯 ${currentTeam} is guessing` : '✨ Reveal'}
                  </p>
                  {phase === 'guess' && settings.timer > 0 && (
                    <span className={`flex items-center gap-1 font-mono font-bold tabular-nums ${timeLeft <= 10 ? 'text-rose-400' : 'text-white/60'}`}>
                      <Timer className="w-4 h-4" /> {timeLeft}s
                    </span>
                  )}
                  {phase === 'psychic' && (
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        drawCard();
                        setTarget(randomTarget());
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white transition-all"
                    >
                      <Shuffle className="w-3.5 h-3.5" /> New card
                    </motion.button>
                  )}
                </div>

                <div className="relative">
                  <Dial
                    target={target}
                    guess={guess}
                    showTarget={phase !== 'guess'}
                    showNeedle={phase !== 'psychic'}
                    interactive={phase === 'guess'}
                    difficulty={settings.difficulty}
                    onGuess={setGuess}
                  />
                  <AnimatePresence>
                    {phase === 'reveal' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.4, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 18 }}
                        className="absolute left-1/2 -translate-x-1/2 top-[18%] px-4 py-2 rounded-2xl bg-black/80 border border-white/15 backdrop-blur text-center"
                      >
                        <p className="text-3xl font-black">{lastPoints ? `+${lastPoints}` : '0'}</p>
                        <p className="text-[11px] text-white/60">
                          {lastPoints === 4 ? 'Bullseye! 🎯' : lastPoints === 3 ? 'So close!' : lastPoints === 2 ? 'Not bad' : 'Missed 😅'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  <CardFace key={card.id} card={card} />
                </AnimatePresence>

                {phase === 'psychic' && (
                  <div className="space-y-3">
                    <input
                      value={clue}
                      onChange={(e) => setClue(e.target.value)}
                      maxLength={60}
                      placeholder="Type your clue (optional) — or just say it out loud"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm focus:outline-none focus:border-white/30"
                    />
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setTimeLeft(settings.timer);
                        setPhase('guess');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-black font-bold"
                    >
                      <EyeOff className="w-5 h-5" /> Hide target & let the team guess
                    </motion.button>
                  </div>
                )}

                {phase !== 'psychic' && clue.trim() && (
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">Clue</p>
                    <p className="text-2xl font-black">“{clue.trim()}”</p>
                  </div>
                )}

                {phase === 'guess' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setGuess((g) => Math.max(0, g - 1))}
                        className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white"
                        aria-label="Nudge left"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      <p className="text-xs text-white/40 w-40 text-center">Drag the dial or nudge the needle</p>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setGuess((g) => Math.min(100, g + 1))}
                        className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white"
                        aria-label="Nudge right"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={lockGuess}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 font-bold shadow-lg shadow-rose-500/20"
                    >
                      <Lock className="w-5 h-5" /> Lock in guess
                    </motion.button>
                  </div>
                )}

                {phase === 'reveal' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={nextTurn}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-black font-bold"
                  >
                    {scores.some((s) => s >= settings.targetScore) ? 'See the winner' : 'Next turn'} <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* ─── Game over ─── */}
            {phase === 'gameover' && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4"
              >
                <motion.p
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  className="text-7xl"
                >
                  🏆
                </motion.p>
                <p className={`text-4xl font-black ${teamColor(leader).text}`}>{settings.teams[leader]} wins!</p>
                <p className="text-white/40 text-sm">{round} round{round > 1 ? 's' : ''} · {Math.max(...scores)} points</p>
                <div className="flex gap-2 mt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-bold"
                  >
                    <RotateCcw className="w-4 h-4" /> Play again
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPhase('setup')}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/15 font-bold"
                  >
                    <Settings2 className="w-4 h-4" /> Settings
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppShell>
  );
}
