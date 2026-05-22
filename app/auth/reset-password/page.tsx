'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Key, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface FieldErrors {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

interface TouchedFields {
  email: boolean;
  resetCode: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}): FieldErrors {
  return {
    email: !fields.email
      ? 'Email is required.'
      : !EMAIL_RE.test(fields.email)
      ? 'Enter a valid email address.'
      : '',
    resetCode: !fields.resetCode
      ? 'Reset code is required.'
      : fields.resetCode.length !== 6
      ? 'Reset code must be 6 characters.'
      : '',
    newPassword: fields.newPassword.length < 8 ? 'Password must be at least 8 characters.' : '',
    confirmPassword:
      fields.confirmPassword !== fields.newPassword ? 'Passwords do not match.' : '',
  };
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    resetCode: false,
    newPassword: false,
    confirmPassword: false,
  });

  function handleBlur(field: keyof FieldErrors) {
    setTouched(t => ({ ...t, [field]: true }));
    const current = { email, resetCode, newPassword, confirmPassword };
    setErrors(e => ({ ...e, [field]: validate(current)[field] }));
  }

  function handleChange(field: keyof FieldErrors, value: string) {
    const updates = { email, resetCode, newPassword, confirmPassword, [field]: value };
    if (field === 'email') setEmail(value);
    if (field === 'resetCode') setResetCode(value.toUpperCase().slice(0, 6));
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (touched[field]) setErrors(e => ({ ...e, [field]: validate(updates)[field] }));
    setServerError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const current = { email, resetCode, newPassword, confirmPassword };
    const errs = validate(current);
    setTouched({ email: true, resetCode: true, newPassword: true, confirmPassword: true });
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setServerError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
      } else {
        setServerError(json.error ?? 'Reset failed. Check your code and try again.');
      }
    } catch {
      setServerError('Network error. Please try again.');
    }
    setLoading(false);
  }

  const fieldClass = (field: keyof FieldErrors) =>
    `w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border text-white text-sm placeholder:text-white/15 focus:outline-none focus:bg-white/[0.06] transition-all ${
      touched[field] && errors[field]
        ? 'border-red-500/50 focus:border-red-500/60'
        : 'border-white/[0.08] focus:border-violet-500/40'
    }`;

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
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Password reset!</h2>
            <p className="text-white/35 text-sm mb-6">Your password has been updated successfully.</p>
            <Link href="/auth/login">
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all">
                Sign in
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm"
          >
            <h1 className="text-2xl font-black text-white mb-1">Reset password</h1>
            <p className="text-white/35 text-sm mb-7">Enter your reset code and a new password.</p>

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

              <div>
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
                  Reset Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    type="text"
                    value={resetCode}
                    onChange={e => handleChange('resetCode', e.target.value)}
                    onBlur={() => handleBlur('resetCode')}
                    placeholder="XXXXXX"
                    className={`${fieldClass('resetCode')} font-mono tracking-[0.2em] uppercase`}
                    maxLength={6}
                  />
                </div>
                {touched.resetCode && errors.resetCode && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
                    {errors.resetCode}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => handleChange('newPassword', e.target.value)}
                    onBlur={() => handleBlur('newPassword')}
                    placeholder="Min. 8 characters"
                    className={`${fieldClass('newPassword')} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.newPassword && errors.newPassword && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
                    {errors.newPassword}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-white/30 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="••••••••"
                    className={fieldClass('confirmPassword')}
                  />
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <p className="text-red-400 text-xs">{serverError}</p>
                </motion.div>
              )}

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
                  <>Reset password <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-sm text-white/25 mt-6">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
