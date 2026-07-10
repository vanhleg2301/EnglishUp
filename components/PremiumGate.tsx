'use client';

import { motion } from 'framer-motion';
import { Lock, Crown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isNativeIOS } from '@/lib/platform';

interface PremiumGateProps {
  children?: React.ReactNode;
  featureName?: string;
  /** overlay: blurs children (default). fullscreen: replaces content entirely */
  mode?: 'overlay' | 'fullscreen';
}

function LockCard({ featureName }: { featureName?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-[#0d0d1a]/95 backdrop-blur-md border border-violet-500/25 rounded-2xl p-6 mx-4 text-center max-w-xs w-full"
    >
      <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-3">
        <Lock className="w-5 h-5 text-violet-400" />
      </div>
      <h3 className="font-black text-white text-base mb-1">
        {featureName ? `${featureName} requires Pro` : 'Pro feature'}
      </h3>
      <p className="text-white/40 text-sm mb-4">
        Upgrade to unlock all lessons and features.
      </p>
      {isNativeIOS() ? (
        <p className="text-white/30 text-xs">Manage your subscription at englishup.vn</p>
      ) : (
        <Link href="/pricing">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/20">
            <Crown className="w-3.5 h-3.5" />
            Upgrade to Pro
          </div>
        </Link>
      )}
    </motion.div>
  );
}

export default function PremiumGate({ children, featureName, mode = 'overlay' }: PremiumGateProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    if (mode === 'fullscreen') {
      return (
        <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      );
    }
    return <>{children}</>;
  }

  const isPremium = !user || user.role === 'admin' || user.subscription?.status === 'active';

  if (isPremium) return <>{children}</>;

  if (mode === 'fullscreen') {
    return (
      <div className="min-h-screen bg-[#07070f] flex flex-col">
        <div className="px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LockCard featureName={featureName} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none" aria-hidden>
        <div className="opacity-30 blur-[2px]">{children}</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <LockCard featureName={featureName} />
      </div>
    </div>
  );
}
