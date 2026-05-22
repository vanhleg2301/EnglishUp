'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface FieldErrors {
  name: string;
  email: string;
  password: string;
  confirmPw: string;
}

interface TouchedFields {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPw: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (pw.length === 0) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
  if (score === 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { level: 2, label: 'Fair', color: 'bg-amber-400' };
  return { level: 3, label: 'Strong', color: 'bg-emerald-400' };
}

function validate(fields: { name: string; email: string; password: string; confirmPw: string }): FieldErrors {
  return {
    name: fields.name.trim().length < 2 ? 'Name must be at least 2 characters.' : '',
    email: !fields.email ? 'Email is required.' : !EMAIL_RE.test(fields.email) ? 'Enter a valid email address.' : '',
    password: fields.password.length < 8 ? 'Password must be at least 8 characters.' : '',
    confirmPw: fields.confirmPw !== fields.password ? 'Passwords do not match.' : '',
  };
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({ name: '', email: '', password: '', confirmPw: '' });
  const [touched, setTouched] = useState<TouchedFields>({ name: false, email: false, password: false, confirmPw: false });

  const strength = getPasswordStrength(password);

  function handleBlur(field: keyof FieldErrors) {
    setTouched(t => ({ ...t, [field]: true }));
    const current = { name, email, password, confirmPw };
    setErrors(e => ({ ...e, [field]: validate(current)[field] }));
  }

  function handleChange(field: keyof FieldErrors, value: string) {
    const updates = { name, email, password, confirmPw, [field]: value };
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPw') setConfirmPw(value);
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(updates)[field] }));
    if (field === 'password' && touched.confirmPw) {
      setErrors(e => ({ ...e, confirmPw: value !== confirmPw ? 'Passwords do not match.' : '' }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const current = { name, email, password, confirmPw };
    const errs = validate(current);
    setTouched({ name: true, email: true, password: true, confirmPw: true });
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        await new Promise(r => setTimeout(r, 1200));
        router.push('/app');
      } else {
        setLoading(false);
        setErrors(prev => ({ ...prev, email: json.error ?? 'Registration failed.' }));
        setTouched(prev => ({ ...prev, email: true }));
      }
    } catch {
      setLoading(false);
      setErrors(prev => ({ ...prev, email: 'Network error. Please try again.' }));
      setTouched(prev => ({ ...prev, email: true }));
    }
  }

  const fieldClass = (field: keyof FieldErrors) =>
    `w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm placeholder:text-white/15 focus:outline-none focus:bg-white/[0.06] transition-all ${
      touched[field] && errors[field]
        ? 'border-red-500/50 focus:border-red-500/60'
        : 'border-white/[0.08] focus:border-violet-500/40'
    }`;

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-16"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Account created!</h2>
        <p className="text-white/40 text-sm">Taking you to the app...</p>
      </motion.div>
    );
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

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
        <h1 className="text-2xl font-black text-white mb-1">Start for free</h1>
        <p className="text-white/35 text-sm mb-7">No credit card required. 7 days on us.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={e => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Nguyen Van A"
                className={fieldClass('name')}
              />
            </div>
            {touched.name && errors.name && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
                {errors.name}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                className={fieldClass('email')}
              />
            </div>
            {touched.email && errors.email && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Min. 8 characters"
                className={`${fieldClass('password')} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        strength.level >= i ? strength.color : 'bg-white/[0.08]'
                      }`}
                    />
                  ))}
                </div>
                {strength.label && (
                  <p className={`text-xs ${strength.level === 1 ? 'text-red-400' : strength.level === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {strength.label}
                  </p>
                )}
              </div>
            )}
            {touched.password && errors.password && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => handleChange('confirmPw', e.target.value)}
                onBlur={() => handleBlur('confirmPw')}
                placeholder="••••••••"
                className={fieldClass('confirmPw')}
              />
            </div>
            {touched.confirmPw && errors.confirmPw && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
                {errors.confirmPw}
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
              <>Create account <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </motion.button>

          <p className="text-center text-[11px] text-white/15">
            By signing up you agree to our Terms of Service.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/15 text-xs">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => { window.location.href = '/api/auth/google'; }}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/60 font-semibold text-sm transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>
        </form>
      </div>

      <p className="text-center text-sm text-white/25 mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
