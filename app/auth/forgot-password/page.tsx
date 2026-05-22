'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2, Copy, Check } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  function validateEmail(value: string): string {
    if (!value) return 'Email is required.';
    if (!EMAIL_RE.test(value)) return 'Enter a valid email address.';
    return '';
  }

  function handleChange(value: string) {
    setEmail(value);
    if (touched) setError(validateEmail(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    setError(err);
    if (err) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.success) {
        setResetCode(json.data?.resetCode ?? '');
        setSent(true);
      } else {
        setError(json.error ?? 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link href="/" className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-sm shadow-lg shadow-violet-500/30">
          EN
        </div>
        <div>
          <p className="font-extrabold text-base text-white leading-none">EnglishUp</p>
          <p className="text-white/30 text-xs mt-0.5">for developers</p>
        </div>
      </Link>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm"
          >
            <h1 className="text-2xl font-black text-white mb-1">Forgot password?</h1>
            <p className="text-white/35 text-sm mb-7">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={() => {
                      setTouched(true);
                      setError(validateEmail(email));
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm placeholder:text-white/15 focus:outline-none focus:bg-white/[0.06] transition-all ${
                      touched && error
                        ? 'border-red-500/50 focus:border-red-500/60'
                        : 'border-white/[0.08] focus:border-violet-500/40'
                    }`}
                  />
                </div>
                {touched && error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5 ml-1"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-violet-500/20"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Send reset link <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Reset code generated</h2>
            <p className="text-white/35 text-sm mb-5">
              Use this code on the reset password page.
            </p>
            {resetCode && (
              <div className="mb-5">
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.10]">
                  <span className="font-mono text-3xl font-black text-white tracking-[0.25em]">
                    {resetCode}
                  </span>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(resetCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-2 rounded-lg hover:bg-white/[0.07] transition-colors text-white/40 hover:text-white/70"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            <Link href="/auth/reset-password">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all">
                Go to reset password
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center mt-6">
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 text-sm text-white/25 hover:text-white/50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    </motion.div>
  );
}
