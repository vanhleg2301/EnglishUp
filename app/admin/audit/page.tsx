'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface AuditEntry {
  id: string;
  action: string;
  resource: string;
  userEmail: string;
  status: 'success' | 'error' | 'warning';
  createdAt: string;
  metadata?: Record<string, unknown>;
}

type FilterStatus = 'all' | 'success' | 'error' | 'warning';
const STATUS_FILTERS: FilterStatus[] = ['all', 'success', 'error', 'warning'];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'text-emerald-400',
  LOGIN_GOOGLE: 'text-emerald-400',
  REGISTER: 'text-cyan-400',
  REGISTER_GOOGLE: 'text-cyan-400',
  LOGOUT: 'text-white/40',
  LOGIN_FAILED: 'text-red-400',
  ADMIN_UPDATE_USER: 'text-amber-400',
  ADMIN_DELETE_USER: 'text-red-400',
  ADMIN_CREATE_USER: 'text-violet-400',
};

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [lastRefresh, setLastRefresh] = useState<number | null>(null);

  const fetchAudit = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/audit?limit=100');
      const json = await res.json();
      if (json.success) setEntries(json.data ?? []);
    } catch {
      // silent
    }
    setLoading(false);
    setLastRefresh(Date.now());
  }, []);

  useEffect(() => { fetchAudit(); }, [fetchAudit]);

  useEffect(() => {
    const interval = setInterval(fetchAudit, 30000);
    return () => clearInterval(interval);
  }, [fetchAudit]);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.status === filter);

  const counts = {
    all: entries.length,
    success: entries.filter(e => e.status === 'success').length,
    error: entries.filter(e => e.status === 'error').length,
    warning: entries.filter(e => e.status === 'warning').length,
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-400" />
                Audit Log
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                Auto-refreshes every 30s
                {lastRefresh !== null && (
                  <span className="ml-2 text-white/20" suppressHydrationWarning>
                    · Last: {timeAgo(new Date(lastRefresh).toISOString())}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={fetchAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white/40 hover:text-white/70 text-xs transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 mb-5">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                  filter === f
                    ? 'bg-violet-500/15 border-violet-500/25 text-violet-300'
                    : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/60'
                }`}
              >
                {f}
                <span className={`ml-1.5 text-[10px] ${filter === f ? 'text-violet-400/70' : 'text-white/20'}`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            {loading ? (
              <div className="px-5 py-10 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="px-5 py-10 text-center text-white/25 text-sm">No entries found.</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filtered.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.01] transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      entry.status === 'success' ? 'bg-emerald-400' :
                      entry.status === 'error' ? 'bg-red-400' : 'bg-amber-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-mono font-bold ${ACTION_COLORS[entry.action] ?? 'text-white/80'}`}>
                          {entry.action}
                        </span>
                        <span className="text-xs text-white/25">{entry.resource}</span>
                      </div>
                      <p className="text-xs text-white/30 truncate mt-0.5">{entry.userEmail || '—'}</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/25 text-xs flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {timeAgo(entry.createdAt)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
