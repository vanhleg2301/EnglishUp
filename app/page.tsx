'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Layers, MessageSquare, Music2,
  ArrowRight, CheckCircle, Zap, Mic, Brain,
  ChevronDown, Star, Trophy, Target,
  Play, Sparkles, Globe, Code2, Bot, X,
  Flame, BarChart2, Headphones, GraduationCap,
} from 'lucide-react';
import Logo from '@/components/Logo';

/* ─── data ─── */

const STATS = [
  { value: 30,  suffix: '',  label: 'days of content',    icon: BookOpen,  color: 'text-violet-400' },
  { value: 5,   suffix: '+', label: 'learning modes',     icon: Layers,    color: 'text-cyan-400'   },
  { value: 500, suffix: '+', label: 'words & phrases',    icon: MessageSquare, color: 'text-emerald-400' },
  { value: 0,   suffix: '',  label: 'boring grammar rules', icon: GraduationCap, color: 'text-amber-400' },
];

const FEATURES = [
  {
    icon: BookOpen,
    color: 'from-violet-500 to-indigo-500',
    glow: 'rgba(139,92,246,0.25)',
    title: '30-Day Speaking Course',
    desc: 'Structured daily lessons that take you from hesitant to fluent in real workplace contexts.',
    tags: ['Listening', 'Speaking', 'Writing'],
  },
  {
    icon: Bot,
    color: 'from-violet-500 to-cyan-500',
    glow: 'rgba(139,92,246,0.3)',
    title: 'AI Conversation Partner',
    desc: 'Practice real-world scenarios — stand-ups, interviews, negotiations — with an AI that corrects you in context.',
    tags: ['AI', 'Speaking', 'Corrections'],
    badge: 'Pro',
    badgeStyle: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
  {
    icon: Layers,
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6,182,212,0.25)',
    title: 'Shadowing Practice',
    desc: 'The fastest way to fix your accent — listen to native speakers and mirror their rhythm and intonation.',
    tags: ['Accent', 'Rhythm', 'Intonation'],
  },
  {
    icon: MessageSquare,
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.25)',
    title: 'Phrases & Collocations',
    desc: '50+ real chunks: office talk, tech jargon, meeting language, and email expressions.',
    tags: ['Collocations', 'Idioms', 'Context'],
    badge: 'New',
    badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    icon: Mic,
    color: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.25)',
    title: 'AI Pronunciation Scoring',
    desc: 'Speak and get instant feedback — see exactly which words need work and why.',
    tags: ['AI Feedback', 'Phonetics', 'Scoring'],
  },
  {
    icon: Music2,
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.25)',
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
    week: 'Week 1', theme: 'Office English',
    color: 'from-violet-500/15 to-indigo-500/10',
    border: 'border-violet-500/25', dot: 'bg-violet-500', days: '7 days',
    emoji: '💼',
    topics: ['Introductions', 'Meetings', 'Emails', 'Small talk', 'Phone calls', 'Problem solving', 'Wrap-up'],
  },
  {
    week: 'Week 2', theme: 'Travel & Navigation',
    color: 'from-cyan-500/15 to-blue-500/10',
    border: 'border-cyan-500/25', dot: 'bg-cyan-500', days: '8 days',
    emoji: '✈️',
    topics: ['Airport', 'Hotel', 'Restaurants', 'Directions', 'Transport', 'Emergency', 'Sightseeing', 'Shopping'],
  },
  {
    week: 'Week 3', theme: 'Tech Communication',
    color: 'from-emerald-500/15 to-teal-500/10',
    border: 'border-emerald-500/25', dot: 'bg-emerald-500', days: '7 days',
    emoji: '💻',
    topics: ['Stand-ups', 'Code reviews', 'Demos', 'Jargon', 'Slack etiquette', 'Debugging talks', 'Tech docs'],
  },
  {
    week: 'Week 4', theme: 'Career Growth',
    color: 'from-amber-500/15 to-orange-500/10',
    border: 'border-amber-500/25', dot: 'bg-amber-500', days: '8 days',
    emoji: '🚀',
    topics: ['Interviews', 'Negotiation', 'Feedback', 'Networking', 'Presentation', 'Leadership', 'Conflicts', 'Mastery'],
  },
];

interface PricingFeature { text: string; locked: boolean; highlight?: boolean }

const PRICING: { name: string; price: string; period: string; desc: string; color: string; highlight: boolean; badge?: string; features: PricingFeature[]; cta: string; ctaStyle: string; href: string }[] = [
  {
    name: 'Free', price: 'Free', period: '',
    desc: 'Try the method for 7 days. No credit card.',
    color: 'border-white/[0.08]', highlight: false,
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
    ctaStyle: 'bg-white/[0.06] hover:bg-white/[0.10] text-white/80 border border-white/10',
    href: '/app',
  },
  {
    name: 'Pro', price: '$8', period: '/month',
    desc: 'Everything you need to actually get fluent.',
    color: 'border-violet-500/40', highlight: true, badge: 'Most popular',
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
    ctaStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20',
    href: '/app',
  },
  {
    name: 'Team', price: '$24', period: '/month',
    desc: 'For teams that want to level up English together.',
    color: 'border-white/[0.08]', highlight: false,
    features: [
      { text: 'Everything in Pro', locked: false },
      { text: 'Up to 10 team members', locked: false },
      { text: 'Team progress dashboard', locked: false },
      { text: 'Custom lesson paths', locked: false },
      { text: 'Priority support', locked: false },
      { text: 'Slack / Teams integration', locked: false },
    ],
    cta: 'Contact us',
    ctaStyle: 'bg-white/[0.06] hover:bg-white/[0.10] text-white/80 border border-white/10',
    href: 'mailto:contact@englishup.dev',
  },
];

const TESTIMONIALS = [
  { name: 'Minh Tú', role: 'Backend Engineer · Hanoi', avatar: 'MT', text: 'After 2 weeks I stopped freezing in stand-ups. The shadowing feature changed everything for my accent.', stars: 5 },
  { name: 'Lan Anh', role: 'Frontend Dev · HCMC', avatar: 'LA', text: 'The AI chat is scary accurate. It corrects me exactly like a real English mentor would.', stars: 5 },
  { name: 'Hoàng Bảo', role: 'DevOps · Da Nang', avatar: 'HB', text: 'I used Duolingo for 2 years and learned nothing useful. Day 3 here and I already have better meeting phrases.', stars: 5 },
];

/* ─── counter ─── */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started || value === 0) { setCount(value); return; }
    let cur = 0;
    const step = value / 40;
    const t = setInterval(() => {
      cur += step;
      if (cur >= value) { setCount(value); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 1200 / 40);
    return () => clearInterval(t);
  }, [started, value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── page ─── */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060610] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] backdrop-blur-2xl bg-[#060610]/75"
      >
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Logo href="/" size="md" />
          <nav className="hidden md:flex items-center gap-7">
            {['Features', 'How it works', 'Curriculum', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-white/45 hover:text-white text-sm transition-colors duration-200">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <button className="px-4 py-2 text-white/55 hover:text-white text-sm font-medium transition-colors">Log in</button>
            </Link>
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors"
              >
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* bg glows */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-700/12 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/5 w-[400px] h-[400px] bg-indigo-700/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-cyan-600/8 rounded-full blur-[80px]" />
          {/* dot grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-6xl mx-auto px-4 py-24 w-full">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">

            {/* Left: copy */}
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-7">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-violet-300 text-xs font-semibold">30-day structured program</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
                className="text-5xl md:text-[64px] font-black leading-[1.04] tracking-tight mb-6">
                Speak English
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  like you mean&nbsp;it.
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.16 }}
                className="text-white/40 text-lg leading-relaxed max-w-md mb-10">
                Not for exams. For stand-ups, code reviews, and working
                with teammates who don&apos;t speak your language.
                <span className="text-white/60 font-medium"> Built for Vietnamese developers.</span>
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}
                className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/app">
                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold text-base transition-all shadow-lg shadow-violet-500/30">
                    <Play className="w-4 h-4 fill-white" />
                    Start Day 1 — Free
                  </motion.button>
                </Link>
                <a href="#how-it-works">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] font-semibold text-base transition-all">
                    See how it works
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </motion.button>
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {['V', 'T', 'M', 'H', 'L'].map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#060610] flex items-center justify-center text-[11px] font-bold"
                      style={{ background: `hsl(${250 + i * 20}, 70%, 50%)` }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-white/35 text-xs">Loved by 500+ Vietnamese devs</p>
                </div>
              </motion.div>
            </div>

            {/* Right: mock app */}
            <motion.div initial={{ opacity: 0, x: 40, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block">
              <HeroAppPreview />
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <ChevronDown className="w-5 h-5 text-white/15" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex flex-col items-center justify-center gap-3 py-10 px-6 bg-[#060610] text-center">
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white">
                      <Counter value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-white/35 text-sm mt-0.5">{s.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">What&apos;s inside</p>
            <h2 className="text-3xl md:text-[42px] font-black mb-4 leading-tight">Everything you need to speak confidently</h2>
            <p className="text-white/40 max-w-lg mx-auto text-lg">Not just lessons — a complete system that trains your ear, your mouth, and your instincts.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -5 }}
                  className="relative group">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl -z-10"
                    style={{ background: f.glow }} />
                  <div className="relative p-6 rounded-2xl bg-white/[0.025] border border-white/[0.07] group-hover:border-white/[0.14] group-hover:bg-white/[0.04] transition-all h-full flex flex-col">
                    {f.badge && (
                      <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full border ${f.badgeStyle ?? ''}`}>
                        {f.badge}
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} p-px mb-5`}>
                      <div className="w-full h-full rounded-[14px] bg-[#0a0a18] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/80" />
                      </div>
                    </div>
                    <h3 className="font-bold text-base mb-2 text-white">{f.title}</h3>
                    <p className="text-white/38 text-sm leading-relaxed flex-1">{f.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {f.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.04] text-white/35 border border-white/[0.06]">
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
      <section id="how-it-works" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.012] to-transparent pointer-events-none" />
        <div className="absolute inset-0 border-y border-white/[0.04] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">The method</p>
            <h2 className="text-3xl md:text-[42px] font-black mb-4 leading-tight">How it actually works</h2>
            <p className="text-white/40 max-w-md mx-auto text-lg">Three phases per day, each building on the last. Takes 10–15 minutes.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.num}
                  initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.14 }}
                  className="relative p-7 rounded-2xl bg-white/[0.025] border border-white/[0.07] group hover:border-white/[0.12] hover:bg-white/[0.04] transition-all">
                  <div className="absolute top-7 right-7 text-5xl font-black text-white/[0.04] select-none">{step.num}</div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} p-px mb-6`}>
                    <div className="w-full h-full rounded-[13px] bg-[#0a0a18] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/38 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section id="curriculum" className="py-28">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">The roadmap</p>
            <h2 className="text-3xl md:text-[42px] font-black mb-4 leading-tight">30 days. 4 worlds.</h2>
            <p className="text-white/40 max-w-md mx-auto text-lg">Each week covers a different context — so what you learn immediately applies to something real.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRICULUM.map((w, i) => (
              <motion.div key={w.week}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.015 }}
                className={`relative p-7 rounded-2xl bg-gradient-to-br ${w.color} border ${w.border} overflow-hidden group cursor-default`}>
                <div className="absolute top-0 right-0 text-[80px] leading-none opacity-10 select-none -mt-3 -mr-2">{w.emoji}</div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">{w.week} · {w.days}</span>
                      <h3 className="text-xl font-black mt-1">{w.theme}</h3>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${w.dot} mt-1.5 ring-4 ring-white/10`} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {w.topics.map(topic => (
                      <span key={topic} className="text-xs px-2.5 py-1 rounded-lg bg-black/20 text-white/55 border border-white/[0.08] backdrop-blur-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 border-y border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-700/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-14">
            <p className="text-rose-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">What learners say</p>
            <h2 className="text-3xl md:text-[42px] font-black mb-4 leading-tight">Real devs, real results</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.025] border border-white/[0.07] flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= t.stars ? 'fill-amber-400 text-amber-400' : 'fill-white/10 text-white/10'}`} />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/30">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-28">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.18em] mb-3">Pricing</p>
            <h2 className="text-3xl md:text-[42px] font-black mb-4 leading-tight">Simple, honest pricing</h2>
            <p className="text-white/40 max-w-md mx-auto text-lg">Start free. Upgrade when you&apos;re ready. No hidden fees.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {PRICING.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className={`relative rounded-2xl border ${plan.color} p-7 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-violet-900/25 to-indigo-900/15 shadow-xl shadow-violet-500/10'
                    : 'bg-white/[0.02]'
                }`}>
                {plan.highlight && plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold whitespace-nowrap shadow-lg shadow-violet-500/25">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-7">
                  <p className="text-white/45 text-sm font-semibold mb-1.5">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-white/35 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-white/30 text-sm">{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat.text} className="flex items-start gap-2.5 text-sm">
                      {feat.locked ? (
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/15" />
                      ) : (
                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-violet-400' : 'text-white/25'}`} />
                      )}
                      <span className={feat.locked ? 'text-white/18 line-through' : feat.highlight ? 'text-violet-300 font-semibold' : plan.highlight ? 'text-white/75' : 'text-white/45'}>
                        {feat.text}
                        {feat.highlight && (
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">AI</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.ctaStyle}`}>
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-violet-600/12 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-7">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-semibold">No credit card required</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
              Your first lesson is{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                one click away.
              </span>
            </h2>
            <p className="text-white/38 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Stop re-watching the same YouTube tutorials. Build real speaking habits, one day at a time.
            </p>
            <Link href="/app">
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(124,58,237,0.45)' }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-bold text-lg transition-all shadow-2xl shadow-violet-500/30">
                <Zap className="w-5 h-5" />
                Start Day 1 — Free
                <ArrowRight className="w-4.5 h-4.5" />
              </motion.button>
            </Link>
            <p className="text-white/18 text-xs mt-5">10–15 min/day · No signup needed to start.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <Logo href="/" size="sm" />
            <nav className="flex items-center gap-6 text-white/28 text-sm">
              <a href="#features" className="hover:text-white/60 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white/60 transition-colors">Pricing</a>
              <Link href="/app" className="hover:text-white/60 transition-colors">App</Link>
              <Link href="/sources" className="hover:text-white/60 transition-colors">Sources</Link>
            </nav>
            <div className="flex items-center gap-2 text-white/20 text-xs">
              <Globe className="w-3.5 h-3.5" />
              <span>Built for Vietnamese developers worldwide</span>
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-white/15 text-xs">© 2025 EnglishUp. Made with care in Vietnam.</p>
            <div className="flex items-center gap-1.5 text-white/15 text-xs">
              <Code2 className="w-3 h-3" />
              <span>Open for developers, by developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Hero App Preview (right side) ─── */
function HeroAppPreview() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'shadowing' | 'streak'>('lessons');

  return (
    <div className="relative flex justify-center items-center">
      {/* Ambient glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-cyan-600/10 rounded-[36px] blur-3xl scale-90" />

      {/* Device frame */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="relative w-full max-w-[380px]"
      >
        {/* Outer shell */}
        <div className="relative bg-[#0d0d1c] border border-white/[0.12] rounded-[28px] shadow-2xl overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              {/* mini logo */}
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-[9px] font-black text-white">E</span>
              </div>
              <span className="text-[11px] font-bold text-white/80">EnglishUp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/20">
                <span className="text-[10px]">🔥</span>
                <span className="text-amber-300 text-[10px] font-bold">7 days</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/15 border border-violet-500/20">
                <Zap className="w-3 h-3 text-violet-400" />
                <span className="text-violet-300 text-[10px] font-bold">350 XP</span>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-px px-3 pt-3 pb-0">
            {([
              { id: 'lessons',   label: 'Lessons',   icon: BookOpen },
              { id: 'shadowing', label: 'Shadow',    icon: Headphones },
              { id: 'streak',    label: 'Progress',  icon: BarChart2 },
            ] as const).map(t => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold rounded-t-lg transition-all ${
                    active
                      ? 'bg-violet-500/15 border-t border-x border-violet-500/25 text-violet-300'
                      : 'text-white/30 hover:text-white/50'
                  }`}>
                  <Icon className="w-3 h-3" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="min-h-[320px]">
            <AnimatePresence mode="wait">
              {activeTab === 'lessons' && (
                <motion.div key="lessons"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 space-y-2">
                  {/* Progress */}
                  <div className="flex justify-between text-[10px] text-white/30 mb-1">
                    <span>3/30 days done</span><span>10%</span>
                  </div>
                  <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden mb-3">
                    <motion.div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                      initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1, delay: 0.3 }} />
                  </div>
                  {[
                    { label: 'Day 1 · Office', emoji: '💼', done: true,   stars: 3, active: false },
                    { label: 'Day 2 · Emails', emoji: '📧', done: true,   stars: 2, active: false },
                    { label: 'Day 3 · Meetings', emoji: '📋', done: false, stars: 0, active: true  },
                    { label: 'Day 4 · Feedback', emoji: '💬', done: false, stars: 0, active: false },
                    { label: 'Day 5 · Phone calls', emoji: '📞', done: false, stars: 0, active: false },
                  ].map((item, idx) => (
                    <motion.div key={item.label}
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.07 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        item.active
                          ? 'bg-white text-black shadow-md shadow-black/20'
                          : item.done
                          ? 'bg-white/[0.04] border border-white/[0.07]'
                          : 'bg-white/[0.015] border border-white/[0.04] opacity-45'
                      }`}>
                      <span className="text-base leading-none">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-bold truncate ${item.active ? 'text-black' : 'text-white/80'}`}>{item.label}</p>
                        {item.done && (
                          <div className="flex gap-0.5 mt-0.5">
                            {[1,2,3].map(s => (
                              <Star key={s} className={`w-2 h-2 ${s <= item.stars ? 'fill-amber-400 text-amber-400' : 'fill-white/10 text-white/10'}`} />
                            ))}
                          </div>
                        )}
                      </div>
                      {item.active && <span className="text-[9px] font-black text-black/50 uppercase">GO</span>}
                      {item.done && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'shadowing' && (
                <motion.div key="shadowing"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">Shadow practice</p>
                  {/* Waveform visualization */}
                  <div className="flex items-center gap-[3px] h-12 justify-center mb-4">
                    {Array.from({ length: 32 }, (_, i) => (
                      <motion.div key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-violet-600 to-cyan-400 opacity-70"
                        animate={{ height: [4, Math.random() * 40 + 8, 4] }}
                        transition={{ repeat: Infinity, duration: 1.2 + Math.random() * 0.8, delay: i * 0.04 }} />
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] mb-3">
                    <p className="text-xs text-white/60 leading-relaxed">
                      &ldquo;Could you walk me through your approach to this problem?&rdquo;
                    </p>
                    <p className="text-[10px] text-white/25 mt-1">B2 · Business English</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-300 text-[10px] font-bold">Recording…</span>
                    </div>
                    <div className="px-3 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center">
                      <span className="text-white/40 text-[10px] font-semibold">84%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'streak' && (
                <motion.div key="streak"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-4">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-3">This week</p>
                  <div className="grid grid-cols-7 gap-1.5 mb-5">
                    {['M','T','W','T','F','S','S'].map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                          i < 5 ? 'bg-violet-500/30 border border-violet-500/40 text-violet-300'
                          : i === 5 ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300 ring-2 ring-amber-500/30'
                          : 'bg-white/[0.04] border border-white/[0.07] text-white/25'
                        }`}>
                          {i < 5 ? '✓' : i === 5 ? '→' : '·'}
                        </div>
                        <span className="text-[9px] text-white/25">{d}</span>
                      </div>
                    ))}
                  </div>
                  {/* Badges */}
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Badges</p>
                  <div className="space-y-1.5">
                    {[
                      { icon: '🔥', name: '7-Day Streak', earned: true },
                      { icon: '🎤', name: 'Pronunciation Pro', earned: true },
                      { icon: '🏆', name: 'Shadowing Master', earned: false },
                    ].map((b) => (
                      <div key={b.name} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg ${b.earned ? 'bg-white/[0.04] border border-white/[0.08]' : 'opacity-35'}`}>
                        <span className="text-base">{b.icon}</span>
                        <span className={`text-[11px] font-semibold ${b.earned ? 'text-white/70' : 'text-white/25'}`}>{b.name}</span>
                        {b.earned && <CheckCircle className="w-3 h-3 text-emerald-400 ml-auto flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom: daily challenge bar */}
          <div className="mx-3 mb-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
            <span className="text-base">⚡</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-amber-300">Daily Challenge</p>
              <p className="text-[9px] text-white/30">Fill in the Blank · +50 XP</p>
            </div>
            <span className="text-[10px] font-black text-amber-400 uppercase">Go</span>
          </div>
        </div>

        {/* Floating notification: badge */}
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
          className="absolute -right-4 top-16 bg-[#0d1a20] border border-emerald-500/30 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-black/40 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🏅</span>
            <div>
              <p className="text-emerald-300 text-[10px] font-bold">Badge unlocked!</p>
              <p className="text-white/30 text-[9px]">First Week</p>
            </div>
          </div>
        </motion.div>

        {/* Floating notification: xp */}
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          className="absolute -left-4 bottom-20 bg-[#130d1f] border border-violet-500/30 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-black/40 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <div>
              <p className="text-violet-300 text-[10px] font-bold">+50 XP earned</p>
              <p className="text-white/30 text-[9px]">Daily challenge</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
