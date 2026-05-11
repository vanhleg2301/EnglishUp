'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Layers, MessageSquare, Music2, Link2,
  ArrowRight, CheckCircle, Zap, Mic, Brain,
  ChevronDown, Star, Trophy, Target,
  Play, Sparkles, Globe, Code2, Bot, X,
} from 'lucide-react';

/* ─── constants ─── */

const STATS = [
  { value: 30, suffix: '', label: 'days of content' },
  { value: 5, suffix: '+', label: 'learning modes' },
  { value: 500, suffix: '+', label: 'words & phrases' },
  { value: 0, suffix: '', label: 'boring grammar rules' },
];

const FEATURES = [
  {
    icon: BookOpen,
    color: 'from-violet-500 to-indigo-500',
    glow: 'rgba(139,92,246,0.3)',
    title: '30-Day Speaking Course',
    desc: 'Structured daily lessons that take you from hesitant to fluent in real workplace contexts.',
    tags: ['Listening', 'Speaking', 'Writing'],
  },
  {
    icon: Bot,
    color: 'from-violet-500 to-cyan-500',
    glow: 'rgba(139,92,246,0.35)',
    title: 'AI Conversation Partner',
    desc: 'Practice real-world scenarios — stand-ups, interviews, negotiations — with an AI that gently corrects your mistakes in context.',
    tags: ['AI', 'Speaking', 'Corrections'],
    badge: 'Pro',
    badgeStyle: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
  {
    icon: Layers,
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6,182,212,0.3)',
    title: 'Shadowing Practice',
    desc: 'The fastest way to fix your accent — listen to native speakers and mirror their rhythm and intonation.',
    tags: ['Accent', 'Rhythm', 'Intonation'],
  },
  {
    icon: MessageSquare,
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Phrases & Collocations',
    desc: '50+ real chunks: office talk, tech jargon, meeting language, and email expressions — not just single words.',
    tags: ['Collocations', 'Idioms', 'Context'],
    badge: 'New',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    icon: Mic,
    color: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.3)',
    title: 'AI Pronunciation Scoring',
    desc: 'Speak and get instant feedback — see exactly which words need work and why.',
    tags: ['AI Feedback', 'Phonetics', 'Scoring'],
  },
  {
    icon: Music2,
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
    title: 'IPA Phonetics',
    desc: 'Master the sounds Vietnamese speakers struggle with most — no more guessing how words are pronounced.',
    tags: ['Sounds', 'Vietnamese', 'Correction'],
  },
];

const STEPS = [
  {
    num: '01',
    icon: Brain,
    color: 'from-violet-500 to-indigo-600',
    title: 'Learn in context',
    desc: 'Each day introduces vocabulary and phrases through real workplace scenarios — not isolated word lists.',
  },
  {
    num: '02',
    icon: Target,
    color: 'from-cyan-500 to-blue-600',
    title: 'Practice and test',
    desc: 'Fill-in-the-blank, listening drills, word order — exercises that mirror how the brain actually retains language.',
  },
  {
    num: '03',
    icon: Mic,
    color: 'from-emerald-500 to-teal-600',
    title: 'Speak and get scored',
    desc: 'Record yourself, get AI feedback on pronunciation, and shadow native speakers until it clicks.',
  },
];

const CURRICULUM = [
  {
    week: 'Week 1',
    theme: 'Office English',
    color: 'from-violet-500/20 to-indigo-500/20',
    border: 'border-violet-500/30',
    dot: 'bg-violet-500',
    days: '7 days',
    topics: ['Introductions', 'Meetings', 'Emails', 'Small talk', 'Phone calls', 'Problem solving', 'Wrap-up'],
  },
  {
    week: 'Week 2',
    theme: 'Travel & Navigation',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    dot: 'bg-cyan-500',
    days: '8 days',
    topics: ['Airport', 'Hotel', 'Restaurants', 'Directions', 'Transport', 'Emergency', 'Sightseeing', 'Shopping'],
  },
  {
    week: 'Week 3',
    theme: 'Tech Communication',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    days: '7 days',
    topics: ['Stand-ups', 'Code reviews', 'Demos', 'Jargon', 'Slack etiquette', 'Debugging talks', 'Tech docs'],
  },
  {
    week: 'Week 4',
    theme: 'Career Growth',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    days: '8 days',
    topics: ['Interviews', 'Negotiation', 'Feedback', 'Networking', 'Presentation', 'Leadership', 'Conflicts', 'Mastery'],
  },
];

const PRICING = [
  {
    name: 'Free',
    price: 'Free',
    period: '',
    desc: 'Try the method for 7 days. No credit card.',
    color: 'border-white/10',
    highlight: false,
    features: [
      { text: '7 days of structured lessons', locked: false },
      { text: 'Vocabulary cards + exercises', locked: false },
      { text: 'IPA phonetics reference', locked: false },
      { text: '1 daily challenge per day', locked: false },
      { text: 'Progress tracking', locked: false },
      { text: 'AI Conversation Partner', locked: true },
      { text: 'All 30 lessons', locked: true },
    ],
    cta: 'Start for free',
    ctaStyle: 'bg-white/8 hover:bg-white/12 text-white border border-white/10',
    href: '/app',
  },
  {
    name: 'Pro',
    price: '$8',
    period: '/month',
    desc: 'Everything you need to actually get fluent.',
    color: 'border-violet-500/50',
    highlight: true,
    badge: 'Most popular',
    features: [
      { text: 'All 30 days unlocked', locked: false },
      { text: 'AI Conversation Partner', locked: false, highlight: true },
      { text: 'Shadowing training (A2–C1)', locked: false },
      { text: 'Phrases & Collocations library', locked: false },
      { text: 'AI pronunciation scoring', locked: false },
      { text: 'Unlimited daily challenges', locked: false },
      { text: 'Badge & streak system', locked: false },
    ],
    cta: 'Get Pro',
    ctaStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white',
    href: '/app',
  },
  {
    name: 'Team',
    price: '$24',
    period: '/month',
    desc: 'For teams that want to level up English together.',
    color: 'border-white/10',
    highlight: false,
    features: [
      { text: 'Everything in Pro', locked: false },
      { text: 'Up to 10 team members', locked: false },
      { text: 'Team progress dashboard', locked: false },
      { text: 'Custom lesson paths', locked: false },
      { text: 'Priority support', locked: false },
      { text: 'Slack / Teams integration', locked: false },
    ],
    cta: 'Contact us',
    ctaStyle: 'bg-white/8 hover:bg-white/12 text-white border border-white/10',
    href: 'mailto:contact@englishup.dev',
  },
];

/* ─── animated counter ─── */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 1200;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [hasStarted, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── main component ─── */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080812] text-white overflow-x-hidden">

      {/* ── Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] backdrop-blur-xl bg-[#080812]/80"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-sm">
              EN
            </div>
            <div>
              <p className="font-extrabold text-base leading-none tracking-tight">EnglishUp</p>
              <p className="text-white/30 text-xs">for developers</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'How it works', 'Curriculum', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <Link href="/app">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors"
            >
              <span>Go to app</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-cyan-600/8 rounded-full blur-[80px]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-6xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-violet-300 text-xs font-semibold">30-day structured program</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              Speak English
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                like you mean it.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/45 text-lg md:text-xl leading-relaxed max-w-xl mb-10"
            >
              Not for exams. For stand-ups, code reviews, and working
              with teammates who don't speak your language.
              Built for Vietnamese developers.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/app">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold text-base transition-all shadow-lg shadow-violet-500/25"
                >
                  <Play className="w-4 h-4" />
                  Start Day 1 — Free
                </motion.button>
              </Link>
              <a href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 font-semibold text-base transition-all"
                >
                  See how it works
                  <ChevronDown className="w-4 h-4 text-white/50" />
                </motion.button>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4 mt-8"
            >
              <div className="flex -space-x-2">
                {['V', 'T', 'M', 'H', 'L'].map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#080812] bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-white/40 text-xs">Loved by 500+ Vietnamese devs</p>
              </div>
            </motion.div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 w-[420px]"
          >
            <MockAppCard />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-black text-white mb-1">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-white/35 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-3">What's inside</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Everything you need to speak confidently</h2>
            <p className="text-white/40 max-w-lg mx-auto">Not just lessons — a complete system that trains your ear, your mouth, and your instincts.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{ background: f.glow }}
                  />
                  <div className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] group-hover:border-white/15 transition-all h-full flex flex-col">
                    {f.badge && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {f.badge}
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} p-0.5 mb-4`}>
                      <div className="w-full h-full rounded-[14px] bg-[#080812] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/80" />
                      </div>
                    </div>
                    <h3 className="font-bold text-base mb-2">{f.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed flex-1">{f.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {f.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.07]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">The method</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">How it actually works</h2>
            <p className="text-white/40 max-w-lg mx-auto">Three phases per day, each building on the last. Takes 10–15 minutes.</p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 mb-6`}>
                    <div className="w-full h-full rounded-[14px] bg-[#080812] flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white/80" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#080812] border border-white/15 flex items-center justify-center">
                      <span className="text-[10px] font-black text-white/50">{step.num}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section id="curriculum" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">The roadmap</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">30 days. 4 worlds.</h2>
            <p className="text-white/40 max-w-lg mx-auto">Each week covers a different context — so what you learn immediately applies to something real.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRICULUM.map((w, i) => (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${w.color} border ${w.border} relative overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider">{w.week} · {w.days}</p>
                    <h3 className="text-xl font-black mt-1">{w.theme}</h3>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${w.dot} mt-1.5`} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {w.topics.map(topic => (
                    <span key={topic} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.06] text-white/60 border border-white/[0.08]">
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Simple, honest pricing</h2>
            <p className="text-white/40 max-w-lg mx-auto">Start free. Upgrade when you're ready. No hidden fees, no auto-renewal surprises.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl border ${plan.color} p-6 ${plan.highlight ? 'bg-gradient-to-b from-violet-900/20 to-indigo-900/20' : 'bg-white/[0.02]'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold whitespace-nowrap">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-white/50 text-sm font-semibold mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-white/40 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-white/35 text-sm">{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat.text} className="flex items-start gap-2.5 text-sm">
                      {feat.locked ? (
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/15" />
                      ) : (
                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-violet-400' : 'text-white/30'}`} />
                      )}
                      <span className={
                        feat.locked
                          ? 'text-white/20 line-through'
                          : feat.highlight
                          ? 'text-violet-300 font-semibold'
                          : plan.highlight
                          ? 'text-white/80'
                          : 'text-white/50'
                      }>
                        {feat.text}
                        {feat.highlight && (
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 not-italic">AI</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-6">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-semibold">No credit card required</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Your first lesson is{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                one click away.
              </span>
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
              Stop re-watching the same YouTube tutorials. Build real speaking habits, one day at a time.
            </p>

            <Link href="/app">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold text-lg transition-all shadow-2xl shadow-violet-500/30"
              >
                <Zap className="w-5 h-5" />
                Start Day 1 — Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <p className="text-white/20 text-xs mt-4">10–15 min/day. No signup needed to start.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-sm">
                EN
              </div>
              <div>
                <p className="font-extrabold text-sm leading-none">EnglishUp</p>
                <p className="text-white/25 text-xs mt-0.5">for developers</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/30 text-sm">
              <a href="#features" className="hover:text-white/60 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white/60 transition-colors">Pricing</a>
              <Link href="/app" className="hover:text-white/60 transition-colors">App</Link>
              <Link href="/sources" className="hover:text-white/60 transition-colors">Sources</Link>
            </div>

            <div className="flex items-center gap-2 text-white/20 text-xs">
              <Globe className="w-3.5 h-3.5" />
              <span>Built for Vietnamese developers worldwide</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-white/15 text-xs">© 2025 EnglishUp. Made with care in Vietnam.</p>
            <div className="flex items-center gap-1 text-white/15 text-xs">
              <Code2 className="w-3 h-3" />
              <span>Open for developers, by developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Mock app preview card ─── */
function MockAppCard() {
  const items = [
    { label: 'Day 1 · Office', emoji: '💼', done: true, stars: 3 },
    { label: 'Day 2 · Emails', emoji: '📧', done: true, stars: 2 },
    { label: 'Day 3 · Meetings', emoji: '📋', done: false, active: true },
    { label: 'Day 4 · Feedback', emoji: '💬', done: false },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/20 to-transparent rounded-3xl blur-xl" />
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="relative bg-[#0e0e1a] border border-white/10 rounded-3xl p-5 shadow-2xl"
      >
        {/* Mini header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-black">EN</div>
            <span className="text-xs font-bold">EnglishUp</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/20">
            <span className="text-amber-400 text-[10px] font-bold">🔥 7 days</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
            <span>3/30 days done</span>
            <span>10%</span>
          </div>
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '10%' }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Lesson list */}
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                item.active
                  ? 'bg-white text-black'
                  : item.done
                  ? 'bg-white/[0.04] border border-white/[0.06]'
                  : 'bg-white/[0.02] border border-white/[0.04] opacity-40'
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-bold truncate ${item.active ? 'text-black' : 'text-white'}`}>{item.label}</p>
                {item.done && (
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3].map(s => (
                      <Star key={s} className={`w-2 h-2 ${s <= (item.stars ?? 0) ? 'fill-amber-400 text-amber-400' : 'fill-white/10 text-white/10'}`} />
                    ))}
                  </div>
                )}
              </div>
              {item.active && (
                <span className="text-[9px] font-black text-black/50 uppercase tracking-wider">Go</span>
              )}
              {item.done && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* XP bar */}
        <div className="mt-4 flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs text-white/50 font-semibold">350 XP earned</span>
          <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden ml-1">
            <div className="h-full w-[35%] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="absolute -right-6 top-8 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-3 py-2"
      >
        <p className="text-emerald-300 text-[10px] font-bold">🏅 First Week</p>
        <p className="text-white/30 text-[9px]">Badge unlocked!</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute -left-6 bottom-8 bg-amber-500/15 border border-amber-500/30 rounded-2xl px-3 py-2"
      >
        <p className="text-amber-300 text-[10px] font-bold">⚡ Daily challenge</p>
        <p className="text-white/30 text-[9px]">+50 XP earned</p>
      </motion.div>
    </div>
  );
}
