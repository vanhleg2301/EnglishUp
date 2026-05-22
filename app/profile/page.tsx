'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Crown, Calendar, Key, CheckCircle2, Loader2, Flame, Zap, BookOpen, RotateCcw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/hooks/useProgress';

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { progress, resetProgress } = useProgress();
  const [editName, setEditName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  if (!user) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-6 h-6 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      </AppShell>
    );
  }

  async function handleReset() {
    setResetting(true);
    await resetProgress();
    setResetting(false);
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!editName.trim() || editName.trim().length < 2) {
      setSaveError('Name must be at least 2 characters.');
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshUser();
        setSaveSuccess(true);
        setEditMode(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(json.error ?? 'Failed to save.');
      }
    } catch {
      setSaveError('Network error.');
    }
    setSaving(false);
  }

  const subStatusColor = {
    free: 'text-white/40 bg-white/[0.04] border-white/[0.08]',
    active: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    expired: 'text-red-300 bg-red-500/10 border-red-500/20',
  }[user.subscription.status];

  const planLabel = {
    free: 'Free',
    monthly: 'Monthly Pro',
    yearly: 'Yearly Pro',
  }[user.subscription.plan];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-black text-white mb-1">Profile</h1>
          <p className="text-white/35 text-sm">Manage your account settings</p>
        </motion.div>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] flex items-center gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white flex-shrink-0 shadow-lg shadow-violet-500/25">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-white truncate">{user.name}</p>
            <p className="text-sm text-white/40 truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                user.role === 'admin'
                  ? 'text-amber-300 bg-amber-500/10 border-amber-500/25'
                  : 'text-violet-300 bg-violet-500/10 border-violet-500/25'
              }`}>
                <Shield className="w-2.5 h-2.5" />
                {user.role === 'admin' ? 'Admin' : 'User'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${subStatusColor}`}>
                <Crown className="w-2.5 h-2.5" />
                {planLabel}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Edit name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-white">Display Name</h2>
            {!editMode && (
              <button
                onClick={() => { setEditMode(true); setEditName(user.name); setSaveError(''); }}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-semibold"
              >
                Edit
              </button>
            )}
          </div>
          {editMode ? (
            <form onSubmit={handleSaveName} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                <input
                  type="text"
                  value={editName}
                  onChange={e => { setEditName(e.target.value); setSaveError(''); }}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/40 text-white text-sm placeholder:text-white/15 focus:outline-none focus:bg-white/[0.06] transition-all"
                />
              </div>
              {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setSaveError(''); }}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.04] text-white/40 text-sm hover:text-white/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm">{user.name}</span>
              {saveSuccess && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-xs text-emerald-400"
                >
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </motion.span>
              )}
            </div>
          )}
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-white">Subscription</h2>
            {user.subscription.status !== 'active' && (
              <Link href="/pricing" className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-semibold">
                Upgrade
              </Link>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-semibold">{planLabel}</p>
              <p className={`text-xs mt-0.5 capitalize ${
                user.subscription.status === 'active' ? 'text-emerald-400' :
                user.subscription.status === 'expired' ? 'text-red-400' : 'text-white/35'
              }`}>
                {user.subscription.status}
                {user.subscription.status === 'active' && user.subscription.expiresAt &&
                  ` · Expires ${formatDate(user.subscription.expiresAt)}`
                }
              </p>
            </div>
            {user.subscription.status === 'free' && (
              <Link href="/pricing">
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-500 hover:to-indigo-500 transition-all">
                  Upgrade to Pro
                </div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Account info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] space-y-4"
        >
          <h2 className="font-bold text-sm text-white">Account Info</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <Mail className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-wider font-bold">Email</p>
                <p className="text-sm text-white/60">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <Shield className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div>
                <p className="text-[10px] text-white/25 uppercase tracking-wider font-bold">Role</p>
                <p className="text-sm text-white/60 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          <h2 className="font-bold text-sm text-white mb-4">Security</h2>
          <Link href="/auth/reset-password">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <Key className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50 transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Change Password</p>
                <p className="text-xs text-white/25">Update your account password</p>
              </div>
              <Calendar className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
          </Link>
        </motion.div>

        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-white">Learning Progress</h2>
            {resetDone && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-xs text-emerald-400"
              >
                <CheckCircle2 className="w-3 h-3" /> Reset done
              </motion.span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-lg font-black text-amber-400">{progress.totalXP.toLocaleString()}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-wide">Total XP</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <p className="text-lg font-black text-orange-400">{progress.streak}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-wide">Day Streak</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <p className="text-lg font-black text-violet-400">{progress.completedDays.length}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-wide">Days Done</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showResetConfirm ? (
              <motion.button
                key="reset-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowResetConfirm(true)}
                disabled={progress.completedDays.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-white/35 hover:text-red-400 hover:border-red-500/25 hover:bg-red-500/[0.05] text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/35 disabled:hover:border-white/[0.07] disabled:hover:bg-white/[0.03]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Progress
              </motion.button>
            ) : (
              <motion.div
                key="reset-confirm"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl border border-red-500/20 bg-red-500/[0.05]"
              >
                <div className="flex items-start gap-2.5 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-300">Reset all progress?</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      Xóa toàn bộ {progress.completedDays.length} ngày đã học, {progress.totalXP.toLocaleString()} XP và streak. Không thể hoàn tác.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-lg bg-white/[0.04] text-white/40 text-sm hover:text-white/60 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={resetting}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50"
                  >
                    {resetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppShell>
  );
}
