'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Briefcase, Globe, Code, Layers, Volume2, CheckCircle, ChevronRight } from 'lucide-react';
import Logo from '@/components/Logo';

type Goal = 'office' | 'travel' | 'tech' | 'all';

const GOALS: { id: Goal; icon: React.ElementType; label: string; desc: string }[] = [
  { id: 'office', icon: Briefcase, label: 'Office English', desc: 'Meetings, emails, presentations' },
  { id: 'travel', icon: Globe, label: 'Travel English', desc: 'Airports, hotels, small talk' },
  { id: 'tech', icon: Code, label: 'Tech Interviews', desc: 'System design, coding rounds' },
  { id: 'all', icon: Layers, label: 'All of the above', desc: 'Complete English fluency' },
];

const LEVEL_QUESTIONS: { question: string; options: string[]; answer: number }[] = [
  { question: 'What do you say when you join a meeting late?', options: ['Sorry I am late.', 'Apologies for joining late, I had a conflict.', 'I was busy.', 'Hello everyone!'], answer: 1 },
  { question: 'How do you ask for clarification politely?', options: ['What?', 'I don\'t understand.', 'Could you elaborate on that?', 'Explain more.'], answer: 2 },
  { question: 'Which is the most professional way to disagree?', options: ['That\'s wrong.', 'I see it differently — here\'s my thinking.', 'No, I disagree.', 'I don\'t think so.'], answer: 1 },
  { question: 'How do you propose a follow-up action?', options: ['I will do it.', 'Let\'s circle back on this tomorrow.', 'OK.', 'Later.'], answer: 1 },
  { question: 'What\'s the best way to end a presentation?', options: ['That\'s all.', 'The end.', 'In summary, we\'ve covered X, Y, and Z. Happy to take questions.', 'Done!'], answer: 2 },
];

const LEVEL_MAP: Record<string, string> = {
  '0-1': 'A1',
  '2': 'A2',
  '3': 'B1',
  '4-5': 'B1+',
};

function getLevel(score: number): string {
  if (score <= 1) return 'A1';
  if (score === 2) return 'A2';
  if (score === 3) return 'B1';
  return 'B1+';
}

type Step = 'goal' | 'quiz' | 'result';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  function handleGoalSelect(g: Goal) {
    setGoal(g);
  }

  function handleGoalNext() {
    if (goal) setStep('quiz');
  }

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === LEVEL_QUESTIONS[qIndex].answer) {
      setScore(s => s + 1);
    }
  }

  function handleNext() {
    if (qIndex < LEVEL_QUESTIONS.length - 1) {
      setQIndex(q => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setStep('result');
    }
  }

  function handleFinish() {
    const level = getLevel(score);
    localStorage.setItem('onboarding-done', '1');
    localStorage.setItem('user-goal', goal ?? 'all');
    localStorage.setItem('user-level', level);
    localStorage.setItem('user-start-date', new Date().toISOString());
    router.push('/app');
  }

  const level = getLevel(score);
  const q = LEVEL_QUESTIONS[qIndex];

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-10 flex justify-center">
          <Logo href="/" size="md" />
        </div>

        <AnimatePresence mode="wait">
          {step === 'goal' && (
            <motion.div key="goal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="text-2xl font-bold text-center mb-2">What's your goal?</h1>
              <p className="text-white/40 text-center text-sm mb-8">We'll personalize your learning path based on this.</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {GOALS.map(({ id, icon: Icon, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => handleGoalSelect(id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      goal === id
                        ? 'border-violet-500/60 bg-violet-500/15'
                        : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${goal === id ? 'text-violet-400' : 'text-white/40'}`} />
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={handleGoalNext}
                disabled={!goal}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key={`quiz-${qIndex}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/40 text-sm">Level check</span>
                <span className="text-white/40 text-sm">{qIndex + 1} / {LEVEL_QUESTIONS.length}</span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${((qIndex + 1) / LEVEL_QUESTIONS.length) * 100}%` }} />
              </div>
              <h2 className="text-lg font-bold mb-6">{q.question}</h2>
              <div className="space-y-3 mb-8">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === q.answer;
                  let cls = 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]';
                  if (answered && isCorrect) cls = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
                  else if (answered && isSelected && !isCorrect) cls = 'border-red-500/60 bg-red-500/10 text-red-300';
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} className={`w-full p-4 rounded-xl border text-left text-sm transition-all ${cls}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold flex items-center justify-center gap-2"
                >
                  {qIndex < LEVEL_QUESTIONS.length - 1 ? 'Next Question' : 'See My Level'} <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-3xl font-black text-violet-300">{level}</span>
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Your estimated level: {level}</h2>
                <p className="text-white/40 text-sm">You got {score} out of {LEVEL_QUESTIONS.length} correct</p>
              </div>

              <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-4 h-4 text-violet-400" />
                  <span className="font-semibold text-sm">Your personalized path</span>
                </div>
                <div className="space-y-2 text-sm text-white/60">
                  <p>Goal: <span className="text-white font-medium capitalize">{goal}</span></p>
                  <p>Start: <span className="text-white font-medium">Day 1 — Foundations</span></p>
                  {level === 'A1' && <p className="text-amber-300/80">Focus on: basic vocabulary, pronunciation, everyday phrases</p>}
                  {level === 'A2' && <p className="text-amber-300/80">Focus on: simple conversations, tense usage, common idioms</p>}
                  {level === 'B1' && <p className="text-amber-300/80">Focus on: professional vocabulary, fluency practice, shadowing</p>}
                  {level === 'B1+' && <p className="text-emerald-300/80">Focus on: advanced expressions, accent coaching, tech English</p>}
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Start Learning
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
