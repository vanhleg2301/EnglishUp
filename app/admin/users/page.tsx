'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Shield, Crown, Trash2, UserPlus, Download, X, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  subscription: {
    status: 'free' | 'active' | 'expired';
    plan: 'free' | 'monthly' | 'yearly';
  };
  createdAt: string;
}

type RoleFilter = 'all' | 'admin' | 'user';
type StatusFilter = 'all' | 'active' | 'free' | 'expired';

interface CreateForm {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  plan: 'free' | 'monthly' | 'yearly';
}

const PLAN_LABELS: Record<string, string> = { free: 'Free', monthly: 'Monthly', yearly: 'Yearly' };

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function SkeletonRow() {
  return (
    <tr>
      {[72, 60, 40, 50, 45, 55, 70].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-white/[0.05] rounded animate-pulse" style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function AdminUsersPage() {
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>({ name: '', email: '', password: '', role: 'user', plan: 'free' });
  const [createLoading, setCreateLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  const fetchUsers = useCallback(async (q?: string, role?: string, status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (role && role !== 'all') params.set('role', role);
      if (status && status !== 'all') params.set('status', status);
      const res = await fetch(`/api/admin/users?${params}`);
      const json = await res.json();
      if (json.success) setUsers(json.data ?? []);
    } catch {
      showToast('Failed to fetch users.', 'error');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // open create modal if ?create=1
  useEffect(() => {
    if (searchParams.get('create') === '1') setShowCreate(true);
  }, [searchParams]);

  // debounce search + filters
  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(search, roleFilter, statusFilter), 350);
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter, fetchUsers]);

  async function toggleRole(id: string, currentRole: 'admin' | 'user') {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
        showToast('Role updated.', 'success');
      } else {
        showToast(json.error ?? 'Failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
  }

  async function changePlan(id: string, plan: 'free' | 'monthly' | 'yearly') {
    const status = plan === 'free' ? 'free' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: { plan, status } }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, subscription: { plan, status } } : u));
        showToast('Subscription updated.', 'success');
      } else {
        showToast(json.error ?? 'Failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
  }

  async function deleteUser(id: string) {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        showToast('User deleted.', 'success');
      } else {
        showToast(json.error ?? 'Failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
    setConfirmDelete(null);
  }

  async function createUser() {
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      showToast('Fill in all fields.', 'error');
      return;
    }
    setCreateLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const json = await res.json();
      if (json.success) {
        setUsers(prev => [json.data, ...prev]);
        setShowCreate(false);
        setCreateForm({ name: '', email: '', password: '', role: 'user', plan: 'free' });
        showToast('User created.', 'success');
      } else {
        showToast(json.error ?? 'Failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    }
    setCreateLoading(false);
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Role', 'Plan', 'Status', 'Joined'];
    const rows = users.map(u => [
      `"${u.name}"`, u.email, u.role, u.subscription.plan, u.subscription.status,
      new Date(u.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const ROLE_FILTERS: { label: string; value: RoleFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ];

  const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Pro', value: 'active' },
    { label: 'Free', value: 'free' },
    { label: 'Expired', value: 'expired' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                Users
                {!loading && (
                  <span className="text-sm font-normal text-white/30 ml-1">({users.length})</span>
                )}
              </h1>
              <p className="text-white/40 text-sm mt-0.5">Manage user accounts</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] text-white/50 hover:text-white/80 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25 hover:bg-violet-500/20 text-violet-300 text-xs font-semibold transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create User
              </button>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/40 text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-1">
              {ROLE_FILTERS.map(f => (
                <button key={f.value} onClick={() => setRoleFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    roleFilter === f.value
                      ? 'bg-violet-500/15 border-violet-500/25 text-violet-300'
                      : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {STATUS_FILTERS.map(f => (
                <button key={f.value} onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    statusFilter === f.value
                      ? 'bg-amber-500/15 border-amber-500/25 text-amber-300'
                      : 'bg-white/[0.03] border-white/[0.07] text-white/35 hover:text-white/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['User', 'Role', 'Plan', 'Status', 'Joined', 'Actions'].map(col => (
                      <th key={col} className="px-5 py-3.5 text-left text-[10px] font-bold text-white/25 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {loading ? (
                    <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-white/25 text-sm">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u, i) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        {/* User cell */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                              {u.name ? u.name.slice(0, 2).toUpperCase() : '??'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm text-white/80 font-medium truncate">{u.name}</p>
                              <p className="text-xs text-white/35 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.role === 'admin'
                              ? 'text-amber-300 bg-amber-500/10 border-amber-500/25'
                              : 'text-white/40 bg-white/[0.04] border-white/[0.08]'
                          }`}>
                            <Shield className="w-2.5 h-2.5" />
                            {u.role}
                          </span>
                        </td>

                        {/* Plan dropdown */}
                        <td className="px-5 py-4">
                          <select
                            value={u.subscription.plan}
                            onChange={e => changePlan(u.id, e.target.value as 'free' | 'monthly' | 'yearly')}
                            className={`text-[11px] font-bold px-2 py-1 rounded-lg border bg-transparent cursor-pointer focus:outline-none transition-all ${
                              u.subscription.plan !== 'free'
                                ? 'text-violet-300 border-violet-500/25 bg-violet-500/10'
                                : 'text-white/35 border-white/[0.08] bg-white/[0.03]'
                            }`}
                          >
                            <option value="free" className="bg-[#0d0d18] text-white">Free</option>
                            <option value="monthly" className="bg-[#0d0d18] text-white">Monthly</option>
                            <option value="yearly" className="bg-[#0d0d18] text-white">Yearly</option>
                          </select>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs ${
                            u.subscription.status === 'active' ? 'text-emerald-400' :
                            u.subscription.status === 'expired' ? 'text-red-400' : 'text-white/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              u.subscription.status === 'active' ? 'bg-emerald-400' :
                              u.subscription.status === 'expired' ? 'bg-red-400' : 'bg-white/20'
                            }`} />
                            {u.subscription.status}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4 text-xs text-white/35">{timeAgo(u.createdAt)}</td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleRole(u.id, u.role)}
                              title={u.role === 'admin' ? 'Make user' : 'Make admin'}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] hover:bg-amber-500/10 text-white/40 hover:text-amber-300 border border-white/[0.07] hover:border-amber-500/25 transition-all"
                            >
                              <Crown className="w-3 h-3" />
                            </button>
                            {confirmDelete === u.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => deleteUser(u.id)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 transition-all"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] text-white/30 border border-white/[0.07] transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(u.id)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/10 text-white/25 hover:text-red-400 border border-white/[0.07] transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="w-full max-w-md bg-[#0d0d18] border border-white/[0.1] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <UserPlus className="w-4.5 h-4.5 text-violet-400" />
                  Create User
                </h2>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-white/40 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Nguyen Van A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/40 text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/40 block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/40 text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/40 block mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={createForm.password}
                      onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min. 6 characters"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/40 text-white text-sm placeholder:text-white/20 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/40 block mb-1.5">Role</label>
                    <select
                      value={createForm.role}
                      onChange={e => setCreateForm(p => ({ ...p, role: e.target.value as 'user' | 'admin' }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-violet-500/40 transition-all"
                    >
                      <option value="user" className="bg-[#0d0d18]">User</option>
                      <option value="admin" className="bg-[#0d0d18]">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/40 block mb-1.5">Plan</label>
                    <select
                      value={createForm.plan}
                      onChange={e => setCreateForm(p => ({ ...p, plan: e.target.value as 'free' | 'monthly' | 'yearly' }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-violet-500/40 transition-all"
                    >
                      <option value="free" className="bg-[#0d0d18]">Free</option>
                      <option value="monthly" className="bg-[#0d0d18]">Monthly Pro</option>
                      <option value="yearly" className="bg-[#0d0d18]">Yearly Pro</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 text-sm hover:text-white/60 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createUser}
                  disabled={createLoading}
                  className="flex-1 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-semibold hover:bg-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {createLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </motion.div>
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
                : 'bg-red-500/15 border-red-500/30 text-red-300'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
