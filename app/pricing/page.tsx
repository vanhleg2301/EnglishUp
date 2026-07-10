'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Loader2, CheckCircle2, Zap } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { isNativeIOS } from '@/lib/platform';

const FEATURES = [
  'All 30 lessons',
  '15-day SG Speaking Sprint',
  'AI Conversation practice',
  'Vocabulary SRS',
  'Daily challenges',
  'Progress tracking',
  'Certificate upon completion',
];

const PLANS = [
  {
    id: 'monthly' as const,
    label: 'Monthly',
    price: '99,000',
    currency: 'VND',
    period: 'month',
    popular: false,
  },
  {
    id: 'yearly' as const,
    label: 'Yearly',
    price: '799,000',
    currency: 'VND',
    period: 'year',
    popular: true,
    badge: 'Save 34%',
  },
];

export default function PricingPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Apple Guideline 3.1.1: no purchase flow for digital content outside
  // Apple's In-App Purchase — direct native iOS users to manage on the web instead.
  if (isNativeIOS()) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-bold mb-4">
            <Crown className="w-3 h-3" />
            Pro Plans
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Manage your subscription on the web</h1>
          <p className="text-white/40 text-sm">
            Visit englishup.vn from a browser to view or upgrade your plan.
          </p>
        </div>
      </AppShell>
    );
  }

  async function handleSubscribe(plan: 'monthly' | 'yearly') {
    if (user?.subscription?.status === 'active') {
      showToast('You already have an active subscription.', 'info');
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshUser();
        setSuccess(true);
      } else {
        showToast(json.error ?? 'Checkout failed. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
    setLoading(null);
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-bold mb-4">
            <Crown className="w-3 h-3" />
            Pro Plans
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Unlock everything</h1>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Get full access to all lessons, AI practice, and certificates. One simple price.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">You're Pro now!</h2>
              <p className="text-white/40 text-sm">Enjoy unlimited access to all features.</p>
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10"
            >
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative p-6 rounded-2xl border ${
                    plan.popular
                      ? 'border-violet-500/40 bg-violet-500/[0.05]'
                      : 'border-white/[0.07] bg-white/[0.02]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-violet-500/30">
                        Most popular
                      </span>
                    </div>
                  )}
                  {plan.badge && (
                    <span className="inline-block mb-3 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[10px] font-bold">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="font-black text-white text-lg mb-1">{plan.label}</h3>
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-white/40 text-sm">{plan.currency}/{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {FEATURES.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading !== null || user?.subscription?.status === 'active'}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20'
                        : 'bg-white/[0.06] hover:bg-white/[0.10] text-white border border-white/[0.08]'
                    }`}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : user?.subscription?.status === 'active' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Current plan
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Subscribe {plan.label}
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl border text-sm font-semibold z-50 ${
                toast.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : toast.type === 'error'
                  ? 'bg-red-500/15 border-red-500/30 text-red-300'
                  : 'bg-white/[0.07] border-white/[0.12] text-white/70'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
