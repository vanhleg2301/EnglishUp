'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Activity, Clock, Shield, ChevronRight, UserPlus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface StatsData {
  totalUsers: number;
  activeSubscriptions: number;
  freeUsers: number;
  recentLogins: number;
  newUsersThisWeek: number;
}

interface AuditEntry {
  id: string;
  action: string;
  resource: string;
  userEmail: string;
  status: 'success' | 'error' | 'warning';
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function StatCard({
  label, value, icon: Icon, color, bg, delay, sub,
}: {
  label: string; value: string | number; icon: React.ElementType;
  color: string; bg: string; delay: number; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
    >
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4.5 h-4.5 ${color}`} />
      </div>
      <p className="text-2xl font-black">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-white/40 text-xs mt-0.5">{label}</p>
      {sub && <p className="text-white/20 text-[10px] mt-0.5">{sub}</p>}
    </motion.div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, auditRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/audit?limit=6'),
        ]);
        const statsJson = await statsRes.json();
        const auditJson = await auditRes.json();
        if (statsJson.success) setStats(statsJson.data);
        if (auditJson.success) setAudit(auditJson.data ?? []);
      } catch {
        // silent
      }
      setLoading(false);
    }
    load();
  }, []);

  const STATS = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', delay: 0 },
        { label: 'New This Week', value: stats.newUsersThisWeek, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10', delay: 0.06 },
        { label: 'Pro Subscribers', value: stats.activeSubscriptions, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', delay: 0.12 },
        { label: 'Logins Today', value: stats.recentLogins, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', delay: 0.18, sub: 'last 24h' },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-white/40 text-sm mt-0.5">Platform overview</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-semibold">Live</span>
              </div>
              <Link href="/admin/users?create=1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/25 hover:bg-violet-500/20 transition-colors">
                  <UserPlus className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-violet-300 text-xs font-semibold">Create User</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] mb-3" />
                  <div className="h-8 w-16 bg-white/[0.05] rounded mb-1" />
                  <div className="h-3 w-24 bg-white/[0.03] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {STATS.map(s => <StatCard key={s.label} {...s} />)}
            </div>
          )}

          {/* Summary row */}
          {stats && (
            <div className="flex gap-3 mb-8">
              <div className="flex-1 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                <span className="text-xs text-white/40">Free users</span>
                <span className="text-sm font-bold text-white/60">{stats.freeUsers.toLocaleString()}</span>
              </div>
              <div className="flex-1 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                <span className="text-xs text-white/40">Conversion rate</span>
                <span className="text-sm font-bold text-amber-400">
                  {stats.totalUsers > 0 ? Math.round((stats.activeSubscriptions / stats.totalUsers) * 100) : 0}%
                </span>
              </div>
              <div className="flex-1 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                <span className="text-xs text-white/40">Weekly growth</span>
                <span className="text-sm font-bold text-cyan-400">+{stats.newUsersThisWeek}</span>
              </div>
            </div>
          )}

          {/* Recent Audit Log */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden mb-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                <h2 className="font-bold text-sm">Recent Activity</h2>
              </div>
              <Link href="/admin/audit" className="text-white/30 hover:text-white/60 text-xs transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {loading ? (
              <div className="px-5 py-8 flex justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
              </div>
            ) : audit.length === 0 ? (
              <p className="px-5 py-8 text-center text-white/25 text-sm">No activity yet.</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {audit.map((entry) => (
                  <div key={entry.id} className="px-5 py-3.5 flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      entry.status === 'success' ? 'bg-emerald-400' :
                      entry.status === 'error' ? 'bg-red-400' : 'bg-amber-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white/80">{entry.action}</span>
                        <span className="text-xs text-white/25">{entry.resource}</span>
                      </div>
                      <p className="text-xs text-white/30 truncate">{entry.userEmail}</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/25 text-xs flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {timeAgo(entry.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Manage Users', desc: 'View, create, edit, and delete accounts', href: '/admin/users' },
              { label: 'Lesson Data', desc: 'Browse all 30 lessons and content', href: '/admin/lessons' },
              { label: 'Full Audit Log', desc: 'Complete activity history with filters', href: '/admin/audit' },
            ].map(item => (
              <Link key={item.label} href={item.href}>
                <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                  <p className="text-white/35 text-xs">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
